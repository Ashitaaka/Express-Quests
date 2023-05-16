require("dotenv").config();
//npm install dotenv
//indique que nous avons besoin de variables d'environnement accessible dans le fichier .env

const express = require("express");
//npm install express

const app = express();
app.use(express.json()); // 'middleware' express qui permet de lire les body des requêtes au format "json"

const port = process.env.APP_PORT ?? 5001;
//instancie le port avec la valeur contenue dans la variable d'environement 'APP_PORT' du fichier .env
//Si il n'y a pas de valeur dans le fichier .env, alors la valeur par default est 5001

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);

const movieHandlers = require("./movieHandlers");

// Routes GET
app.get("/api/users", movieHandlers.getUsers);
app.get("/api/users/:id", movieHandlers.getUserById);
app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);


// !! Validators : 'Middleware' to check if the request POST and PUT are valid
const validators = require("./validators.js")

// Routes POST
app.post("/api/movies", validators.validateMovie, movieHandlers.postMovie);
app.post("/api/users", validators.validateUser, movieHandlers.postUser);


//Routes PUT
app.put("/api/movies/:id", validators.validateMovie, movieHandlers.updateMovie);
app.put("/api/users/:id", validators.validateUser, movieHandlers.updateUser)

//Routes DELETE
app.delete("/api/movies/:id", movieHandlers.deleteMovie);
app.delete("/api/users/:id", movieHandlers.deleteUser);

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
