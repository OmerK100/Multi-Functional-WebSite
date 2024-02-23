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

Login page:



![w1](https://github.com/OmerK100/Multi-Functional-Website/assets/139342166/9766da1b-75cd-4a66-b1a8-b37614c98bea)

Main home page with trivia:

![w2](https://github.com/OmerK100/Multi-Functional-Website/assets/139342166/fc3621a4-588c-4729-9867-6eda0c915205)

Trivia play:

![w3](https://github.com/OmerK100/Multi-Functional-Website/assets/139342166/0afb252b-3e09-480e-9bc3-06391da7acff)

Photo gallery (purple is a custom loading bar):

![w4](https://github.com/OmerK100/Multi-Functional-Website/assets/139342166/df02daec-d280-441b-9439-6cd748b8275b)

Shop (not enough creadits to make purchase in that example): 
![w5](https://github.com/OmerK100/Multi-Functional-Website/assets/139342166/c41705c2-778a-4f59-98a3-23229ff1af9f)

Main chat page:

![w7](https://github.com/OmerK100/Multi-Functional-Website/assets/139342166/0ea9b032-1403-4873-b78d-0ae68609f807)

Public chat room creation:

![w8](https://github.com/OmerK100/Multi-Functional-Website/assets/139342166/fde15e05-705e-4bdf-abe3-46697fd10469)

Joining a publlic room:
![w9](https://github.com/OmerK100/Multi-Functional-Website/assets/139342166/761ddefa-4803-407c-b6cc-ef8ad7bb7735)

Messaging in a room and other user leaving:
![w10](https://github.com/OmerK100/Multi-Functional-Website/assets/139342166/1013df74-b619-48ab-9685-1fa459b4031d)

Pop up of request for private chat from other user: (Probably should change the pop up to something else in order not to interupt users, or maybe add some ignore mechanism)
![w11](https://github.com/OmerK100/Multi-Functional-Website/assets/139342166/077de698-0307-4049-a298-453e4706b8df)

Pop up to inform user his private chat request was declined by the receiver:
![w12](https://github.com/OmerK100/Multi-Functional-Website/assets/139342166/a9874fc3-a5a0-41b4-9b4e-417acdec654f)

If the receiver accepts the private chat request both users are immediatley put into a private room to chat:
![w13](https://github.com/OmerK100/Multi-Functional-Website/assets/139342166/ccd5c280-d7fb-4319-8fc3-9aab43ee84e5)

![w14](https://github.com/OmerK100/Multi-Functional-Website/assets/139342166/0e1165f9-03d5-403a-833b-53dff4b45dcc)

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Snippet from database, my users table.
Includes their username, hashed password, email (an email validation middleware was added at some point during the project..) and also amount of their balance (which can go up by answering trivia and go down after purchases in the shop)

![w20](https://github.com/OmerK100/Multi-Functional-Website/assets/139342166/4a88f2f9-ff82-4b3d-bb5d-740037e4b158)





