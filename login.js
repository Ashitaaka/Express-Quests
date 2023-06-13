const database = require('./database');

//Get a user by his email and send it to password validation
const getUserByEmailWithPasswordAndPassToNext = (req, res, next) =>{
  
    database
      .query('SELECT * from users where email = ?', [req.body.email])
      .then(([[user]]) => {
        if(!user){
          res.sendStatus(401);
        }else{
          req.user = user;
          next();
        }
      })
      .catch((err) =>{
        console.error(err);
        res.status(500).send("Error retrieving from database");
      })
  }

const login = (req, res) =>{

    // const { email, password } = req.body;
    if(req.body.email === 'dwight@theoffice.com' && req.body.password === '123456'){
        res.status(200).send('Credantials are valid');
    }else{
        res.sendStatus(401);
    }
}

module.exports = {
    login,
    getUserByEmailWithPasswordAndPassToNext,
};