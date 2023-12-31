import 'dotenv/config';
import express from 'express';
import errorMiddleware from './lib/error-middleware.js';
import ClientError from './lib/client-error.js';
import { authMiddleware } from './lib/authorization-middleware.js';
import pg from 'pg';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { validateLoggedIn, validateParam } from './lib/validate.js';

// eslint-disable-next-line no-unused-vars -- Remove when used
const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();

// Create paths for static directories
const reactStaticDir = new URL('../client/build', import.meta.url).pathname;
const uploadsStaticDir = new URL('public', import.meta.url).pathname;

app.use(express.static(reactStaticDir));
// Static directory for file uploads server/public/
app.use(express.static(uploadsStaticDir));
app.use(express.json());

app.post('/api/auth/sign-up', async (req, res, next) => {
  try {
    const { username, password, firstName, lastName } = req.body;
    validateParam([username, password, firstName, lastName]);
    const hashedPassword = await argon2.hash(password);
    const sql = `
      insert into "user" ("username", "hashedPassword", "firstName", "lastName")
        values ($1, $2, $3, $4)
        returning "userId", "username", "firstName"
    `;
    const params = [username, hashedPassword, firstName, lastName];
    const result = await db.query(sql, params);
    const [user] = result.rows;
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

app.post('/api/auth/sign-in', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new ClientError(401, 'invalid login');
    }
    const sql = `
      select "userId",
             "hashedPassword",
             "firstName",
             "lastName"
        from "user"
        where "username" = $1;
    `;
    const params = [username];
    const result = await db.query(sql, params);
    const [user] = result.rows;
    if (!user) {
      throw new ClientError(401, 'Incorrect Username and/or Password');
    }
    const { userId, hashedPassword, firstName, lastName } = user;
    const isMatching = await argon2.verify(hashedPassword, password);
    if (!isMatching) {
      throw new ClientError(401, 'Incorrect Username and/or Password');
    }
    const payload = { userId, username, firstName, lastName };
    if (!process.env.TOKEN_SECRET) {
      throw new Error('TOKEN_SECRET not found in .env');
    }
    const token = jwt.sign(payload, process.env.TOKEN_SECRET);
    res.json({ token, user: payload });
  } catch (err) {
    next(err);
  }
});

// get all the trips for a user
app.get('/api/trips', authMiddleware, async (req, res, next) => {
  try {
    const userId = validateLoggedIn(req.user);
    const sql = `
          select *
          from "trip"
          where "userId" = $1
          order by "startDate";
    `;
    const params = [userId];
    const result = await db.query(sql, params);
    const data = result.rows;
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// get all events for a trip
app.get('/api/trip/:tripId', authMiddleware, async (req, res, next) => {
  try {
    const userId = validateLoggedIn(req.user);
    const { tripId } = req.params;
    validateParam([tripId]);
    const sql = `
          select  "t".*,
                  "e"."eventId",
                  "e"."eventName",
                  "e"."eventDate",
                  "e"."startTime",
                  "e"."endTime",
                  "e"."location",
                  "e"."notes",
                  "e"."placeId",
                  "e"."lat",
                  "e"."lng"
          from "trip" as "t"
          left join "event" as "e" using ("tripId")
          where "userId" = $1 and "tripId" = $2
          order by "startTime";
    `;
    const params = [userId, tripId];
    const result = await db.query(sql, params);
    const data = result.rows;
    if (data) {
      res.status(200).json(data);
    } else {
      throw new ClientError(404, `Cannot find trip ID ${tripId}`);
    }
  } catch (err) {
    next(err);
  }
});

// create a trip
app.post('/api/trip', authMiddleware, async (req, res, next) => {
  try {
    const userId = validateLoggedIn(req.user);
    const { tripName, startDate, endDate, iconUrl } = req.body;
    validateParam([tripName, startDate, endDate, iconUrl]);
    const sql = `
          insert into  "trip" ("userId", "tripName", "startDate", "endDate", "iconUrl")
          values ($1, $2, $3, $4, $5)
          returning *;
    `;
    const params = [userId, tripName, startDate, endDate, iconUrl];
    const result = await db.query(sql, params);
    const data = result.rows;
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// edit trip
app.put('/api/trip/:tripId', authMiddleware, async (req, res, next) => {
  try {
    const userId = validateLoggedIn(req.user);
    const tripId = Number(req.params.tripId);
    const { tripName, startDate, endDate, iconUrl } = req.body;
    validateParam([tripName, startDate, endDate, iconUrl]);
    const sql = `
          update "trip"
            set "tripName" = $1,
                "startDate" = $2,
                "endDate" = $3,
                "iconUrl" = $4
          where "userId" = $5 and "tripId" = $6
          returning *;
    `;
    const params = [tripName, startDate, endDate, iconUrl, userId, tripId];
    const result = await db.query(sql, params);
    const data = result.rows[0];
    if (data) {
      res.status(200).json(data);
    } else {
      throw new ClientError(404, `Cannot find trip ID ${tripId}`);
    }
  } catch (err) {
    next(err);
  }
});

// delete trip
app.delete('/api/trip/:tripId', authMiddleware, async (req, res, next) => {
  try {
    const userId = validateLoggedIn(req.user);
    const tripId = Number(req.params.tripId);
    validateParam([tripId]);
    // check that the user has access to delete event by checking the tripId for the events belong to the user
    const sql1 = `
            delete
              from "event"
              where "tripId" in (select "tripId" from "trip" where "userId" = $1 and "tripId" = $2)
              returning *;
          `;
    const sql2 = `
            delete
              from "trip"
              where "userId" = $1 and "tripId" = $2
              returning *;
          `;
    const params = [userId, tripId];
    await db.query(sql1, params);
    const result = await db.query(sql2, params);
    const trip = result.rows[0];
    if (trip) {
      res.sendStatus(204);
    } else {
      throw new ClientError(404, `Cannot find trip ID: ${tripId}`);
    }
  } catch (err) {
    next(err);
  }
});

// create event for a trip
app.post(`/api/trip/:tripId`, authMiddleware, async (req, res, next) => {
  const userId = validateLoggedIn(req.user);
  try {
    const {
      tripId,
      eventName,
      eventDate,
      startTime,
      endTime,
      location,
      notes,
      placeId,
      lat,
      lng,
      gPlace,
    } = req.body;
    validateParam([
      tripId,
      eventName,
      eventDate,
      startTime,
      endTime,
      location,
      placeId,
      lat,
      lng,
      gPlace,
    ]);
    // check if user has access to the trip being edited
    const sql1 = `
          select "tripId" from "trip" where "userId" = $1 and "tripId" = $2
    `;
    const params1 = [userId, tripId];
    const userCheck = await db.query(sql1, params1);
    if (!userCheck.rows[0])
      throw new ClientError(
        404,
        `User not permitted to edit trip ID: ${tripId}`
      );

    // add the event once user is verified to have access
    const sql2 = `
          insert into "event" ("tripId", "eventName", "eventDate", "startTime", "endTime", "location", "notes", "placeId", "lat", "lng", "gPlace")
          values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          returning *;
    `;
    const params2 = [
      tripId,
      eventName,
      eventDate,
      startTime,
      endTime,
      location,
      notes,
      placeId,
      lat,
      lng,
      gPlace,
    ];
    const result = await db.query(sql2, params2);
    const data = result.rows;
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// get an event for a trip
app.get(
  `/api/trip/:tripId/event/:eventId`,
  authMiddleware,
  async (req, res, next) => {
    const userId = validateLoggedIn(req.user);
    try {
      const { tripId, eventId } = req.params;
      validateParam([tripId, eventId]);
      const sql = `
          select  "t".*,
                  "e"."eventId",
                  "e"."eventName",
                  "e"."eventDate",
                  "e"."startTime",
                  "e"."endTime",
                  "e"."location",
                  "e"."notes",
                  "e"."placeId",
                  "e"."lat",
                  "e"."lng",
                  "e"."gPlace"
          from "trip" as "t"
          left join "event" as "e" using ("tripId")
          where "userId" = $1 and "tripId" = $2 and "eventId" = $3;
    `;
      const params = [userId, tripId, eventId];
      const result = await db.query(sql, params);
      const data = result.rows[0];
      if (data) {
        res.status(200).json(data);
      } else {
        throw new ClientError(
          404,
          `Cannot find trip ID: ${tripId} or event ID: ${eventId}`
        );
      }
    } catch (err) {
      next(err);
    }
  }
);

// edit event for a trip
app.put(
  `/api/trip/:tripId/event/:eventId`,
  authMiddleware,
  async (req, res, next) => {
    try {
      const userId = validateLoggedIn(req.user);
      const {
        tripId,
        eventId,
        eventName,
        eventDate,
        startTime,
        endTime,
        location,
        notes,
        placeId,
        lat,
        lng,
        gPlace,
      } = req.body;
      validateParam([
        tripId,
        eventId,
        eventName,
        eventDate,
        startTime,
        endTime,
        location,
        placeId,
        lat,
        lng,
        gPlace,
      ]);

      // check if user has access to the trip being edited
      const sql1 = `
            select "tripId" from "trip" where "userId" = $1 and "tripId" = $2
      `;
      const params1 = [userId, tripId];
      const userCheck = await db.query(sql1, params1);
      if (!userCheck.rows[0])
        throw new ClientError(
          404,
          `User not permitted to edit trip ID: ${tripId}`
        );

      // update the event once user is verified to have access
      const sql2 = `
          update "event"
             set "eventName" = $1,
                 "eventDate" = $2,
                 "startTime" = $3,
                 "endTime" = $4,
                 "location" = $5,
                 "notes" = $6,
                 "placeId" = $7,
                 "lat" = $8,
                 "lng" = $9,
                 "gPlace" = $10
          where "tripId" = $11 and "eventId" = $12
          returning *;
    `;
      const params2 = [
        eventName,
        eventDate,
        startTime,
        endTime,
        location,
        notes,
        placeId,
        lat,
        lng,
        gPlace,
        tripId,
        eventId,
      ];
      const result = await db.query(sql2, params2);
      const data = result.rows;
      res.json(data);
    } catch (err) {
      next(err);
    }
  }
);

// delete event for a trip
app.delete(
  `/api/trip/:tripId/event/:eventId`,
  authMiddleware,
  async (req, res, next) => {
    try {
      const userId = validateLoggedIn(req.user);
      const tripId = Number(req.params.tripId);
      const eventId = Number(req.params.eventId);
      validateParam([tripId, eventId]);

      // check if user has access to the trip being edited
      const sql1 = `
            select "tripId" from "trip" where "userId" = $1 and "tripId" = $2
      `;
      const params1 = [userId, tripId];
      const userCheck = await db.query(sql1, params1);
      if (!userCheck.rows[0])
        throw new ClientError(
          404,
          `User not permitted to edit trip ID: ${tripId}`
        );

      // delete the event once user is verified to have access
      const sql2 = `
          delete
              from "event"
              where "tripId" = $1 and "eventId" = $2
              returning *;
          `;
      const params2 = [tripId, eventId];
      const result = await db.query(sql2, params2);
      const data = result.rows;
      res.json(data);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * Serves React's index.html if no api route matches.
 *
 * Implementation note:
 * When the final project is deployed, this Express server becomes responsible
 * for serving the React files. (In development, the Create React App server does this.)
 * When navigating in the client, if the user refreshes the page, the browser will send
 * the URL to this Express server instead of to React Router.
 * Catching everything that doesn't match a route and serving index.html allows
 * React Router to manage the routing.
 */
app.get('*', (req, res) => res.sendFile(`${reactStaticDir}/index.html`));

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
