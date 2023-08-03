set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "public"."event" (
	"eventId" serial NOT NULL,
	"tripId" integer NOT NULL,
	"eventName" TEXT NOT NULL,
	"eventDate" DATE NOT NULL,
	"startTime" TIMESTAMP NOT NULL,
	"endTime" TIMESTAMP NOT NULL,
	"location" TEXT NOT NULL,
	"category" TEXT NOT NULL,
	"notes" TEXT NOT NULL,
	"placeId" TEXT NOT NULL,
	"lat" DECIMAL NOT NULL,
	"lng" DECIMAL NOT NULL,
	CONSTRAINT "event_pk" PRIMARY KEY ("eventId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."user" (
	"userId" serial NOT NULL,
	"firstName" TEXT NOT NULL,
	"lastName" TEXT NOT NULL,
	"username" TEXT NOT NULL,
	"hashedPassword" TEXT NOT NULL,
	CONSTRAINT "user_pk" PRIMARY KEY ("userId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."trip" (
	"tripId" serial NOT NULL,
	"userId" integer NOT NULL,
	"tripName" TEXT NOT NULL,
	"startDate" timestamptz NOT NULL,
	"endDate" timestamptz NOT NULL,
	"iconUrl" TEXT NOT NULL,
	CONSTRAINT "trip_pk" PRIMARY KEY ("tripId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."userTrips" (
	"userTripsId" serial NOT NULL,
	"userId" integer NOT NULL,
	"tripId" integer NOT NULL,
	"eventId" integer NOT NULL,
	CONSTRAINT "userTrips_pk" PRIMARY KEY ("userTripsId")
) WITH (
  OIDS=FALSE
);



ALTER TABLE "event" ADD CONSTRAINT "event_fk0" FOREIGN KEY ("tripId") REFERENCES "trip"("tripId");


ALTER TABLE "trip" ADD CONSTRAINT "trip_fk0" FOREIGN KEY ("userId") REFERENCES "user"("userId");

ALTER TABLE "userTrips" ADD CONSTRAINT "userTrips_fk0" FOREIGN KEY ("userId") REFERENCES "user"("userId");
ALTER TABLE "userTrips" ADD CONSTRAINT "userTrips_fk1" FOREIGN KEY ("tripId") REFERENCES "trip"("tripId");
ALTER TABLE "userTrips" ADD CONSTRAINT "userTrips_fk2" FOREIGN KEY ("eventId") REFERENCES "event"("eventId");
