# A website to showcase (mainly) backend development capablities

## This app consists of a client side and a server side
### Technologies: HTML, EJS, JavaScript, Express.js, PostgresSQL 
Also not finished yet CSS for design implementation

The purpose of the project is to practice frontend, backend and database abilites I have acquired, improve my knowledge and coding ability and also practice use of Git and GitHub

The app is esentially a website with user authentication and authorization (using cookies and sessions) and allowing the user to play around with various features that require a backend to store data securly.
## Features of the app include: 
* Logining and signing up, users are saved in the database, passwords are hashed in the database for security reasons using a dedicated NPM package
* Authorization of the signed in user across different pages using cookies and sessions (with a dedicated NPM package)
* external API for trivia
* Fake balance of credits for each user and the ability to gain and spend the balance on fake items
* Personal image gallery for each user allowing to upload and store several images on the backend, and also retrieve and delete them on demand

#### The pinacle feature of the app:
An online real time chat app for different logged users to chat with other using socket.io package
Users are able to chat privately, create/delete rooms and chat in groups. They can also view names of other users online.

The backend uses a dedicated packages for middleware for the API routes to increase security. Client side initiates requests using fetch API and promises.

The project stil needs some things to be added:
* More CSS design across the pages
* Allow chat app to save users messages history after logout and login back

## Graphic exmaples of the app's pages:

