const database = require("./database"); // importe le fichier database.

// GET ALL USERS
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
  
  // GET USER BY ID
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
  
  // POST USER
  const postUser = (req, res) =>{
    const {firstname, lastname, email, city, language, hashedPassword} = req.body; // on récupère l'objet json envoyé en 'req'
  
    database
     .query(" INSERT INTO users (firstname, lastname, email, city, language, hashedPassword) VALUES (?,?,?,?,?,?)", [firstname, lastname, email, city, language, hashedPassword])
  
     .then(([result]) => {
      res.location(`api/users/${result.insertId}`).sendStatus(201)
     })
  
     .catch((err) =>{
      console.error(err);
      res.status(500).send("Error retrieving data from database")
     })
  }
  
  // UPDATE USER
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
  
  //DELETE USER
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
    getUsers,
    getUserById,
    postUser,
    updateUser,
    deleteUser,
  }