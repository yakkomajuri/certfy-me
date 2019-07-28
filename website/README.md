# certfy

## Getting started

Clone this repository and then use ```npm install``` to install all the necessary packages/dependencies.

You must them make sure you have a Mongo instance running in the background, and you can run ```npm start``` to create a server listening on port 80 (you can also change this). The server uses nodemon and thus keeps track of any changes to the project, so that restarting the server is not necessary.

## Structure

**Server set-up (http + https, SSL, ports):** /bin/www

**Middleware for packages:** app.js

**MongoDB set-up:** /models/user.js

**Handling front-end GET & POST requests:** /routes  
    * **Index:** URL == '/' (External parts of website)  
    * **Users:** URL == '/users/' (Internal parts of website i.e. dashboard)

**Front-end:** /views

**File storage (for future):** /uploads
