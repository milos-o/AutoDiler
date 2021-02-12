const { Model } = require('sequelize');
const Advertisment = require('../../models/Advertisment');
const Sequelize = require('sequelize');
const User = require('../../models/User');
const CarModel=require('../../models/Model');
const Brand=require('../../models/Brand');
const Comment=require('../../models/Comment');

async function getAddByID(req,res,next){
    let id = req.params.id;
    try {        
        let add = await Advertisment.findOne({
            where:{
               id:id 
            },
            attributes:{exclude:["modelId","userId"]},
            include:[{
                model:CarModel,
                attributes: ["id","name"],
                include:{
                    model:Brand,
                    attributes: ["id","name"],
                }
            },
            {
                model:User,
                required:true,
                attributes:["id","username","email"],
            },],
        })
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
    let pageNumber = req.query.page;
    if(!pageNumber) pageNumber=1;
    try {
        let totalAdds = await Advertisment.count();        
        let adds = await Advertisment.findAll({
            
            attributes:{exclude:["modelId","userId"]},
            include:[
                {       
                    model:CarModel,
                    attributes: ["id","name"],
                    include:{
                        model:Brand,
                        attributes: ["id","name"],
                    }
                },
                {
                    model:User,
                    required:true,
                    attributes:["id","username","email"]
                    
                }
            ],
            offset:((pageNumber-1)*20),
            limit:20,
            order:[['createdAt','DESC']],
        });
        let result ={
            adds: adds,
            total: totalAdds
        }
        res.status(200).json(result);
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
            attributes:{exclude:["modelId","userId"]},
            include:[
                {
                    model:CarModel,
                    attributes: ["id","name"],
                    include:{
                        model:Brand,
                        attributes: ["id","name"],
                    }
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

//need to be updated
async function getFilteredAdds(req,res,next){
    let startYear = req.query.startYear;
    let endYear = req.query.endYear;
    let fuel = req.query.fuel;
    let transmission = req.query.transmission;
    let minHp= req.query.minHp;
    let maxHp=req.query.maxHp;
    let minCC=req.query.minCC;
    let maxCC=req.query.maxCC;
    if(!startYear) startYear=0;
    if(!endYear) endYear=0;
    
    let pageNumber = req.query.page;
    if(!pageNumber) pageNumber=1;
    //promjenit....
    //if(!fuel) fuel=[];
    
    let modelId = req.query.modelId;
    let brandId = req.query.brandId;
    if(modelId){

    }
    



}

//maybe add pagination alsoo
async function getAddComments(req,res,next){
    let id = req.params.addId;
    try {
        let comments = await Comment.findAll({
            where:{
                advertismentId:id,
            },
            attributes:{exclude:["advertismentId","userId"]},
            include:{
                model:User,
            }
        });
        res.status(200).json(comments);
    } catch (error) {
        next(error);
    }
}


module.exports = {
    getAddByID,
    getAllAdds,
    getAddsByUser,
    getFilteredAdds,
    getAddComments
}