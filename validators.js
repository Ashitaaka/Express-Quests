const Joi = require("joi");
//npm install joi
//Using Joi to validate the req.body infos

const userSchema = Joi.object({
    firstname: Joi.string().max(255).required(),
    lastname: Joi.string().max(255).required(),
    email: Joi.string().email().max(255).required(),
    hashedPassword : Joi.string().max(255).required()
}) //define the "schema" which validate the datas


const validateUser = (req, res, next) => {
    const {firstname, lastname, email, hashedPassword} = req.body;

    const { error } = userSchema.validate(
        { firstname, lastname, email, hashedPassword },
        { abortEarly : false}
    ); //getting the eventual errors

    if (error) {
        res.status(422).json({ validationErrors : error.details })
    }else{
        next();
    }
};

const validateMovie = (req, res, next) => {
    const {title, director, year, color, duration} = req.body;
    const errorsTable =[];
    if(title == null){
        errorsTable.push({field : "title", message : "is required"})
    } else if(title.length >= 255){
        errorsTable.push({field : "title", message : "must have less than 255 characters"})
    }
    if(director == null){
        errorsTable.push({field : "director", message : "is required"})
    }else if(director.length >= 255){
        errorsTable.push({field : "director", message : "must have less than 255 characters"})
    }
    if(year == null){
        errorsTable.push({field : "year", message : "is required"})
    }else if(year.length >= 255){
        errorsTable.push({field : "year", message : "must have less than 255 characters"})
    }
    if(color == null){
        errorsTable.push({field : "color", message : "is required"})
    }else if(color.length >= 255){
        errorsTable.push({field : "color", message : "must have less than 255 characters"})
    }
    if(duration == null){
        errorsTable.push({field : "duration", message : "is required"})
    }else if(duration.length >= 255){
        errorsTable.push({field : "duration", message : "must have less than 255 characters"})
    }
    
    if (errorsTable.length != 0){
        res.status(422).json({validationError : errorsTable});
    }else{
        next();
    }
}

module.exports = {
    validateMovie,
    validateUser
}