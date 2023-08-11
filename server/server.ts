import 'dotenv/config';
import express from 'express';
import errorMiddleware from './lib/error-middleware.js';
import ClientError from './lib/client-error.js';
import pg from 'pg';

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

// get all the trips for a user
app.get('/api/user/:userId/trips', async (req, res) => {
  const { userId } = req.params;
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
});

// app.get('/api/user/:userId/trip/:tripId', async (req, res) => {
//   const { userId, tripId } = req.params;
//   const sql = `
//         select *
//         from "trip"
//         where "userId" = $1 and "tripId" = $2;
//   `;
//   const params = [userId, tripId];
//   const result = await db.query(sql, params);
//   const data = result.rows;
//   res.json(data);
// });

app.get('/api/user/:userId/trip/:tripId', async (req, res, next) => {
  try {
    const { userId, tripId } = req.params;
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
      throw new ClientError(404, `Cannot find trip`);
    }
  } catch (err) {
    next(err);
  }
});

app.post('/api/trip', async (req, res) => {
  const { userId, tripName, startDate, endDate, iconUrl } = req.body;
  const sql = `
        insert into  "trip" ("userId", "tripName", "startDate", "endDate", "iconUrl")
        values ($1, $2, $3, $4, $5)
        returning *;
  `;
  const params = [userId, tripName, startDate, endDate, iconUrl];
  const result = await db.query(sql, params);
  const data = result.rows;
  res.json(data);
});

app.put('/api/user/:userId/trip/:tripId', async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    const tripId = Number(req.params.tripId);
    const { tripName, startDate, endDate, iconUrl } = req.body;
    if (!userId || !tripId || !tripName || !startDate || !endDate || !iconUrl) {
      throw new ClientError(400, 'Missing parameter');
    }
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
      throw new ClientError(404, `Cannot find trip`);
    }
  } catch (err) {
    next(err);
  }
});

app.delete('/api/user/:userId/trip/:tripId', async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    const tripId = Number(req.params.tripId);
    if (!Number.isInteger(userId) || !Number.isInteger(tripId)) {
      throw new ClientError(400, 'Missing user or trip parameters');
    }
    const sql1 = `
            delete
              from "event"
              where "tripId" = $1
              returning *;
          `;
    const sql2 = `
            delete
              from "trip"
              where "userId" = $1 and "tripId" = $2
              returning *;
          `;
    const params1 = [tripId];
    const params2 = [userId, tripId];
    await db.query(sql1, params1);
    const result = await db.query(sql2, params2);
    const trip = result.rows[0];
    if (trip) {
      res.sendStatus(204);
    } else {
      throw new ClientError(404, `Cannot find trip`);
    }
  } catch (err) {
    next(err);
  }
});

app.post(`/api/user/:userId/trip/:tripId`, async (req, res, next) => {
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
    const sql = `
          insert into "event" ("tripId", "eventName", "eventDate", "startTime", "endTime", "location", "notes", "placeId", "lat", "lng", "gPlace")
          values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          returning *;
    `;
    const params = [
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
    const result = await db.query(sql, params);
    const data = result.rows;
    res.json(data);
  } catch (err) {
    next(err);
  }
});

app.get(
  `/api/user/:userId/trip/:tripId/event/:eventId`,
  async (req, res, next) => {
    try {
      const { userId, tripId, eventId } = req.params;
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
      const data = result.rows;
      if (data) {
        res.status(200).json(data);
      } else {
        throw new ClientError(404, `Cannot find trip`);
      }
    } catch (err) {
      next(err);
    }
  }
);

app.put(
  `/api/user/:userId/trip/:tripId/event/:eventId`,
  async (req, res, next) => {
    try {
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
      const sql = `
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
      const params = [
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
      const result = await db.query(sql, params);
      const data = result.rows;
      res.json(data);
    } catch (err) {
      next(err);
    }
  }
);

app.delete(
  `/api/user/:userId/trip/:tripId/event/:eventId`,
  async (req, res, next) => {
    try {
      const tripId = Number(req.params.tripId);
      const eventId = Number(req.params.eventId);
      const sql = `
          delete
              from "event"
              where "tripId" = $1 and "eventId" = $2
              returning *;
          `;
      const params = [tripId, eventId];
      const result = await db.query(sql, params);
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
