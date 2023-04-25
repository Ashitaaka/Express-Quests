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
      res.status(500).send("Error retrieving data from database")
    })
};

module.exports = {
  getMovies,
  getMovieById,
  getUsers,
  getUserById,
};
