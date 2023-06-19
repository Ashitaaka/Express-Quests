require("dotenv").config();
//npm install dotenv
//indique que nous avons besoin de variables d'environnement accessible dans le fichier .env

const port = process.env.APP_PORT ?? 5001;
// Instancie le port avec la valeur contenue dans la variable d'environement 'APP_PORT' du fichier .env
// Si il n'y a pas de valeur dans le fichier .env, alors la valeur par default est 5001

const express = require("express");
//npm install express

const app = express();
app.use(express.json()); // 'middleware' express qui permet de lire les body des requêtes au format "json"

const { hashPassword, hidePassword, verifyPassword, verifyToken } = require('./auth');
// récupère les fonctions nécessaires au hash ET au masquage des passwords

const { validateUser, validateMovie } = require("./validators.js")
// !! Validators : 'Middleware' to check if the request POST and PUT are valid

const { login, getUserByEmailWithPasswordAndPassToNext } = require ("./login.js")
// Middleware to Get a user by his email and send it to password validation

const { getMovies, getMovieById, postMovie, updateMovie, deleteMovie} = require("./movieHandlers");
// Movies Middlewares

const { getUsers, getUserById, postUser, updateUser, deleteUser } = require("./userHandlers");
// Users Middlewares


const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);

//-----------ROUTES PUBLIQUES--------------//

// Routes GET
app.get("/api/users", getUsers, hidePassword);
app.get("/api/users/:id", getUserById, hidePassword);
app.get("/api/movies", getMovies);
app.get("/api/movies/:id", getMovieById);


// Routes POST
app.post("/api/users", hashPassword, validateUser, postUser);
app.post("/api/login", getUserByEmailWithPasswordAndPassToNext, verifyPassword);



//-----------ROUTES PRIVEES--------------//
app.use(verifyToken)//ask for a token to access to any routes below (thanks to 'verifyToken' Middleware)

// Routes POST
app.post("/api/movies", validateMovie, postMovie);

//Routes PUT
app.put("/api/movies/:id", validateMovie, updateMovie);
app.put("/api/users/:id", hashPassword, validateUser, updateUser)

//Routes DELETE
app.delete("/api/movies/:id", deleteMovie);
app.delete("/api/users/:id", deleteUser);


app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
