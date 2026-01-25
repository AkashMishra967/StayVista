const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        price:Joi.number().required().min(0),
        image:Joi.string().allow("",null),
    }).required(),

});


// if(!newlisting.title){
    //     throw new ExpressError(404,"Title is missing !");
    // }
    // if(!newlisting.description){
    //     throw new ExpressError(404,"Title is description!");
    // }