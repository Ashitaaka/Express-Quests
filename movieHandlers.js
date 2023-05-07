const database = require("./database"); // importe le fichier database.

// Envoi d'une requête à la BDD pour récupérer tous les films
const getMovies = (req, res) => {
  database
  .query('SELECT * FROM movies') // Méthode pour envoyer une requête - query('requête_SQL_entre_guillemets')
  .then(([movies])=>{ //Destructuring pr récupérer index 0 du tableau de réponse qui contient la liste des films
    res.json(movies); //renvoi la liste des films en json
  })
  .catch((err) =>{
    console.error(err)
    res.status(500).send("Error retrieving data from database");
  });
};

// Envoi d'une requête à la BDD pour récupérer un movie par id
const getMovieById = (req, res) => {
  const id = parseInt(req.params.id); //récupère et parse le req.params
  
  database
  .query('SELECT * FROM movies WHERE id = ?', [id])
  .then(([movies])=>{
    if (movies[0] != null) {
      res.json(movies[0]);
    } else {
      res.status(404).send("Not Found");
    }
  })
  .catch((err) => {
    console.error(err)
    res.status(500).send("Error retrieving data from database")
  })
};

// Envoi une requête POST pour créer un nouveau film dans la BDD
const postMovie = (req, res) => {
  const {title, director, year, color, duration} = req.body;
  
  database
   .query("INSERT INTO movies (title, director, year, color, duration) VALUES (?,?,?,?,?)", [title, director, year, color, duration])
   .then(([result]) => {
    /* une requête POST doit renvoyer : 
      -le status HTTP 'created' (201)
      -un en-tête Location pointant vers la nouvelle ressource : /api/movies/ suivi de l'identifiant d'insertion (ici on récupère dynamiquement l'id dans la BDD avec 'result.insertId')
    */
    res.location(`/api/movies/${result.insertId}`).sendStatus(201)
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error saving the movie");
  });
};

// Envoi d'une requête à la BDD pour récupérer tous les users
const getUsers = (req, res) =>{
  database
    .query('SELECT * FROM users')
    .then(([users])=>{
      res.status(200).json(users);
    })
    .catch((err)=>{
      console.error(err);
      res.status(500).send("Error retrieving data from database")
    })
};

// Envoi d'une requête à la BDD pour récupérer un user par id
const getUserById = (req, res) =>{
  const userId = parseInt(req.params.id);

  database
    .query('SELECT * FROM users WHERE id=?', [userId])
    .then(([users])=>{
      if(users[0] != null){
        res.json(users[0]).status(200);
      }else{
        res.status(404).send('Not found');
      };
    })
    .catch((err)=>{
      console.error(err);
      res.status(500).send("Error saving the user")
    })
};

// Envoi une requête POST pour créer un nouveau User dans la BDD

const postUser = (req, res) =>{
  const {firstname, lastname, email, city, language} = req.body; // on récupère l'objet json envoyé en 'req'

  database
   .query(" INSERT INTO users (firstname, lastname, email, city, language) VALUES (?,?,?,?,?)", [firstname, lastname, email, city, language])
   
   .then(([result]) => {
    res.location(`api/users/${result.insertId}`).sendStatus(201)
   })

   .catch((err) =>{
    console.error(err);
    res.status(404).send("Error retrieving data from database")
   })
}


module.exports = {
  getMovies,
  getMovieById,
  getUsers,
  getUserById,
  postMovie,
  postUser,
};
