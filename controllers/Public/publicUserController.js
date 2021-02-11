const { Model } = require('sequelize');
const Advertisment = require('../../models/Advertisment');
const Sequelize = require('sequelize');
const User = require('../../models/User');
const CarModel=require('../../models/Model');
const Brand=require('../../models/Brand');

async function getAddByID(req,res,next){
    let id = req.params.id;
    try {        
        let add = await Advertisment.findByPk(id);
        console.log(add);
        res.status(200).json(add);
    } catch (error) {
        if(!error.statusCode){
            error.statusCode=400;
        }
        next(error);
    }
}

async function getAllAdds(req,res,next){
    try {        
        let adds = await Advertisment.findAll({
            include:[
                {
                    model: CarModel,
                    required: true,
                    include:[{
                        model:Brand,
                        required:true,
                    }]
                },
                {
                    model:User,
                    required:true,
                    
                }
            ]
        });
        res.status(200).json(adds);
    } catch (error) {
        if(!error.statusCode){
            error.statusCode=400;
        }
        next(error);
    }
}
async function getAddsByUser(req,res,next){
    let username=req.params.username;
    try {
        let adds = await Advertisment.findAll({
            where:{
                userId: username
            },
            include:[
                {
                    model: Model,
                    include: Brand
                }
            ]
        });
        res.status(200).json(adds);
    } catch (error) {
        if(!error.statusCode){
            error.statusCode=400;
        }
        next(error);
    }
}

async function getFilteredAdds(req,res,next){
    let modelId = req.query.modelId;
    let brandId = req.query.brandId;
    let startYear = req.query.startYear;
    let endYear = req.query.endYear;
    let fuel = req.query.fuel;
    let transmission = req.query.transmission;
    let minHp= req.query.minHp;
    let maxHp=req.query.maxHp;
    let minCC=req.query.minCC;
    let maxCC=req.query.maxCC;




}
async function getAddComments(req,res){

}


module.exports = {
    getAddByID,
    getAllAdds,
    getAddsByUser,
    getFilteredAdds,
    getAddComments
}