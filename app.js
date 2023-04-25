require("dotenv").config();
//indique que nous avons besoin de variables d'environnement accessible dans le ficjhier .env

const express = require("express");

const app = express();

const port = process.env.APP_PORT ?? 5001;
//instancie le port avec la valeur contenue dans la variable d'environement 'APP_PORT' du fichier .env
//Si il n'y a pas de valeur dans le fichier .env, alors la valeur par default est 5001

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);

const movieHandlers = require("./movieHandlers");

app.get("/api/users", movieHandlers.getUsers);
app.get("/api/users/:id", movieHandlers.getUserById);
app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
