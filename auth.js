const argon2 = require('argon2');
const jwt = require('jsonwebtoken'); //import of JWT 
require("dotenv").config();

const hashingOptions = {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 5,
    parallelism: 1,
  };
  
const hashPassword = (req, res, next) =>{

    argon2
        .hash(req.body.password, hashingOptions)
        .then((hashedPassword) =>{

            req.body.hashedPassword = hashedPassword;
            delete req.body.password;
            next();

        })
        .catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
        
}

const hidePassword = (req, res) =>{
    const users = res.users;
    
    users.map((user) =>{
        delete user.hashedPassword;
    });
    
    res.status(200).json(users);
}

const verifyPassword = (req, res) => {

    argon2
        .verify(req.user.hashedPassword, req.body.password)
        .then((isVerified) => {
            if(!isVerified){
                res.sendStatus(401);
            }else{
                const payload = { sub : req.user.id }; //to store the UserId
                const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

                delete req.user.hashedPassword;
                res.send({ token, user: req.user });
            }
        })
        .catch((err) => {
            console.error(err)
            res.status(500).send("Error retreiving from database")
        })
}

const verifyToken = (req, res, next) => {
   
    try {
      const authorizationHeader = req.get("Authorization");//get the headers.Authorization
        
      if (authorizationHeader == null) {
        throw new Error("Authorization header is missing");
      }
  
      const [type, token] = authorizationHeader.split(" ");
  
      if (type !== "Bearer") {
        throw new Error("Authorization header has not the 'Bearer' type");
      }
  
      req.payload = jwt.verify(token, process.env.JWT_SECRET);
      console.log(req.payload)

      next();
      
    } catch (err) {
      console.error(err);
      res.sendStatus(401);
    }
  };

module.exports = {
    hashPassword,
    hidePassword,
    verifyPassword,
    verifyToken
};