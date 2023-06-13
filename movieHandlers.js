const database = require("./database"); // importe le fichier database.

// Envoi d'une requête à la BDD pour récupérer tous les films
const getMovies = (req, res) => {
  let sql = 'SELECT * FROM movies';
  const sqlValue = [];

  if(req.query.max_duration && req.query.color){
    sql += ' WHERE duration <= ? AND WHERE color = ?'
    sqlValue.push(req.query.max_duration, req.query.color)
  }

  if(req.query.max_duration){
    sql += ' WHERE duration <= ?'
    sqlValue.push(req.query.max_duration)
  }

  if(req.query.color){
    sql += ' WHERE color = ?'
    sqlValue.push(req.query.color)
  }

  database
  .query(sql, sqlValue) // Méthode pour envoyer une requête - query('requête_SQL_entre_guillemets')
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

// Envoi une requête PUT pour modifier un Movie dans la BDD
const updateMovie = (req, res) =>{
  const {title, director, year, color, duration} = req.body;
  const id = parseInt(req.params.id);

  database
  .query("UPDATE movies SET title = ?, director = ?, year = ?, color = ?, duration = ? WHERE id = ?", [title, director, year, color, duration, id])

  .then(([result])=>{
    //The AffectedRows() method returns the number of rows affected by the last SQL INSERT, DELETE, or UPDATE
    if(result.affectedRows === 0){
      res.status(404).send("Not found")
    }else{
      res.sendStatus(204)
    }
  })

  .catch((err) =>{
    console.error(err);
    res.status(500).send("movie hasn't been updated")
  })
}

// Envoi une requête DELETE pour supprimer un Movie dans la BDD
const deleteMovie = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("DELETE FROM movies WHERE id = ?", [id])

    .then(([result]) =>{
      if(result.affectedRows === 0){
        res.status(404).send('Not found');
      } else{
        res.sendStatus(204);
      }
    })

    .catch((err) =>{
      console.error(err);
      res.status(500).send("Error - movie hasn't been deleted")
    });
}


module.exports = {
  getMovies,
  getMovieById,
  postMovie,
  updateMovie,
  deleteMovie,
};
