 # Trippie

A PERN-stack web application for vacationers to plan and visualize their travel itinerary. 

## Why I Built This

I enjoy traveling and experiencing new places and cultures, but my friends and family often found ourselves planning on spreadsheets or through texts. I wanted to create an app that will help us easily organize and share future travel plans. 

## Live Demo

Try the application live at [https://trippie.lawrencewang.dev/](https://trippie.lawrencewang.dev/)

## Technologies Used

- TypeScript
- JavaScript
- React
- Tailwind CSS
- Node.js
- Express.js
- PostgreSQL
- HTML5
- CSS3
- [Luxon](https://moment.github.io/luxon/#/)
- [@react-google-maps/api](https://www.npmjs.com/package/@react-google-maps/api)
- [shadcn/ui](https://ui.shadcn.com/)
- Argon2
- JSON Web Token
- AWS EC2
- Dokku
- Webpack
- Babel

## Features

- Users can create a new trip.
- Users can view their list of created trips.
- Users can edit the trip name and date range.
- Users can create new events for a trip.
- Users can view all events by day for a trip.
- Users can click on an event and view notes for the event in a dropdown.
- Users can click on the pencil icon for an event to view and edit details of the event.
- Users can view their daily itinerary in Google Maps.
- Users can delete an event.
- Users can delete an entire trip.
- Users can sign up for an account.
- Users can sign in to their account.
- Users can log out of their accounts.
- Users can explore the app with a guest account.

## Preview

### Users can view the Google Map location of each event
![View Map Feature](https://trippie.lawrencewang.dev/view-map.gif)

### Users can add an event for a trip
![View Map Feature](https://trippie.lawrencewang.dev/add-event.gif)

## Future Stretch Features
- Users can view routing between markers on map.
- Users can add multiple users to a trip.
  
## Development

### System Requirements

- Node.js
- npm
- PostgreSQL

### Getting Started

1. Clone the repository.

    ```shell
    git clone https://github.com/wang-lawrence/Trippie
    cd Trippie
    ```

1. Install all dependencies with NPM.

    ```shell
    npm install
    ```
    
1. Create a local .env file from provided example file

    ```shell
    cp .env.example .env
    ```

1. Update the DATABASE_URL in your .env file. Switch 'changeMe' to 'trippie'

    ```shell
    DATABASE_URL=postgres://dev:dev@localhost/trippie
    ```
    
1. Set the TOKEN_SECRET from 'changeMe' to your own token secret on your .env file.

    ```shell
    TOKEN_SECRET=changeMe <--
    ```
    
1. Start PostgresSQL
    ```shell
   sudo service postgresql start
    ```
    
1. Import the example database to PostgreSQL.

    ```shell
    createdb trippie
    npm run db:import
    ```

1. To view the database in your browser, use pgweb.

   ```shell
    pgweb --db=trippie
    ```

1. Start the project. Once started you can view the application by opening http://localhost:3000 in your browser.

    ```shell
    npm run dev
    ```
