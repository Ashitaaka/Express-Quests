require("dotenv").config(); //importe 'dotenv' qui nous permettra de récupérer les données du fichier .env
const mysql = require("mysql2/promise"); 

const database = mysql.createPool({
    host : process.env.DB_HOST, // adresse du serveur
    port : process.env.DB_PORT, // Port de la database, à ne pas confondre avec le port de l'App
    user : process.env.DB_USER, // username
    password : process.env.DB_PASSWORD, //password
    database : process.env.DB_NAME, //nom de la base de données
});

// connection à la BDD pour vérifier que tout est ok (pas obligatoire)
database
    .getConnection()
    .then(() =>{
        console.log("Can reach database");
    })
    .catch((err) =>{
        console.log(err);
    });

// Envoi d'une requête à la BDD
database
    .query('SELECT * FROM movies') //Méthode pour envoyer une requête : query('requête_SQL_entre_guillemets')
    .then((result) =>{
        // console.log(result); // renvoi un tableau avec les données ET d'autres infos
        const movies = result[0]; // l'index 0 du tableau contient les données de nos films
        // console.log(movies);
    })
    .catch((err) =>{
        console.log(err);
    });

    module.exports = database; //export du fichier database