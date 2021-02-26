const e = require('express');
const Sequelize = require('sequelize');
const Contact = require('../../../models/Contact');

async function getContactForms(req,res,next){
    let pageNumber = req.query.page;
    if(!pageNumber) pageNumber=1;
    try {
        let total = await Contact.count();
        let messages = await Contact.findAll({
            offset:((pageNumber-1)*20),
            limit:20,
            order:[['createdAt','ASC']],
        });
        let result = {
            messages: messages,
            total:total,
        }
        res.status(200).json(result);

        
    } catch (error) {
        if(!error.statusCode){
            error.statusCode=400;
        }
        next(error);   
    }
}

async function deleteContactForm(req,res,next){
    let id = req.params.messageId;
    try {

        if(!id){
            let err = new Error("Message id doesnt exist");
            err.statusCode=404;
            next(err);
        }

        let message = await Contact.findByPk(id);
        message.destroy();

        res.status(200).json(`Contact message with id:${id} deleted`);
    } catch (error) {
        if(!error.statusCode){
            error.statusCode=400;
        }
        next(error);
    }

}
module.exports = {
    deleteContactForm,
    getContactForms,
}