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

// Envoi d'une requête à la BDD pour récupérer tous les users
const getUsers = (req, res, next) =>{
  let sql = 'SELECT * FROM users';
  const sqlValue = [];

  if(req.query.city){
    sql += ' WHERE city = ?'
    sqlValue.push(req.query.city)

    if(req.query.language){
      sql += ' AND language = ?'
      sqlValue.push(req.query.language)
    }

  }else if(req.query.language){
    sql += ' WHERE language = ?'
    sqlValue.push(req.query.language)
  }

  database
  .query(sql, sqlValue)
    .then(([users])=>{
      // res.status(200).json(users);
      //j'envoie la réponse "users" à mon middleware qui sera responsable d'effacer le hashedPassword de la réponse
      res.users = users;
      next();
    })
    .catch((err)=>{
      console.error(err);
      res.status(500).send("Error retrieving data from database")
    })
};

// Envoi d'une requête à la BDD pour récupérer un user par id
const getUserById = (req, res, next) =>{
  const userId = parseInt(req.params.id);

  database
    .query("SELECT * FROM users WHERE id=?", [userId])
    .then(([users])=>{
      if(users[0] != null){
        //j'envoie la réponse "users" à mon middleware qui sera responsable d'effacer le hashedPassword de la réponse
        res.users = users;
        next();
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
  const {firstname, lastname, email, city, language, hashedPassword} = req.body; // on récupère l'objet json envoyé en 'req'

  database
   .query(" INSERT INTO users (firstname, lastname, email, city, language, hashedPassword) VALUES (?,?,?,?,?,?)", [firstname, lastname, email, city, language, hashedPassword])

   .then(([result]) => {
    res.location(`api/users/${result.insertId}`).sendStatus(201)
   })

   .catch((err) =>{
    console.error(err);
    res.status(404).send("Error retrieving data from database")
   })
}

// Envoi une requête PUT pour modifier un User dans la BDD
const updateUser = (req, res) =>{
  const id = parseInt(req.params.id);
  const {firstname, lastname, email, city, language, hashedPassword} = req.body;

  database
    .query("UPDATE users SET firstname = ?, lastname = ?, email = ?, city = ?, language = ?, hashedPassword = ? WHERE id = ?", [firstname, lastname, email, city, language, hashedPassword, id])

    .then(([result]) =>{
      if(result.affectedRows === 0){
        res.status(404).send("not found");
      }else{
        res.sendStatus(204);
      }
    })

    .catch((err) => {
      console.error(err);
      res.status(500).send("Error - couldn't update the user")
    });
}

const deleteUser = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("delete from users where id = ?", [id])

    .then(([result]) => {
      if(result.affectedRows === 0){
        res.status(404).send("Not Found")
      }else{
        res.sendStatus(204);
      }
    })

    .catch((err) =>{
      console.error(err)
      res.status(500).send("Error - User hasn't been updated")
    })
}


module.exports = {
  getMovies,
  getMovieById,
  getUsers,
  getUserById,
  postMovie,
  postUser,
  updateMovie,
  updateUser,
  deleteMovie,
  deleteUser
};
