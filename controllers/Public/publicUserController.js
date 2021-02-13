const { Model } = require('sequelize');
const Advertisment = require('../../models/Advertisment');
const Sequelize = require('sequelize');
const User = require('../../models/User');
const CarModel=require('../../models/Model');
const Brand=require('../../models/Brand');
const Comment=require('../../models/Comment');
const Op=Sequelize.Op;

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

//need to be updated!!!
async function getFilteredAdds(req,res,next){
    let where1={};
    let where2={};
    let where3={};
    
    if(req.query.startYear && req.query.endYear){
        where1['year']={
            [Op.between]:[req.query.startYear,req.query.endYear]
        }
    }else if(req.query.startYear){
        where1['year']={
           [Op.gte]:req.query.startYear
        }
    }else if(req.query.endYear){

        where1['year']={
            [Op.lte]:req.query.endYear
        }
    }

    if(req.query.fuel) where1['fuel']=req.query.fuel;
   
    if(req.query.minCC && req.query.maxCC){
        where1['cubic']={
            [Op.between]:[req.query.minCC,req.query.maxCC]
        }
    }else if(req.query.minCC){
        where1['cubic']={
            [Op.gte]:req.query.minCC
         }
    }else if(req.query.maxCC){
        where1['cubic']={
            [Op.lte]:req.query.maxCC
         }
    }
    
    let pageNumber = req.query.page;
    if(!pageNumber) pageNumber=1;
    //promjenit....
    //if(!fuel) fuel=[];
    if(req.query.modelId){
        where2['id']=req.query.modelId;
    }
    if(req.query.brandId){
        where3['id']=req.query.brandId;
    }
    try {
       
        let criteria=
        {
        
            attributes:{exclude:["modelId","userId"]},
            where:where1,
            include:[
                {      
                    model:CarModel,
                    attributes: ["id","name"],
                    include:{
                        model:Brand,
                        attributes: ["id","name"],
                        where:where2,
                        
                    },
                    where:where3,
                },
                {
                    model:User,
                    required:true,
                    attributes:["id","username","email"],
                    
                }
            ],
            
        }
        
        let totalAdds = await Advertisment.count();  
        
        //ading limits
        criteria.limit=20;
        criteria.order=[['createdAt','DESC']];
        criteria.offset=((pageNumber-1)*20);
        
        let adds = await Advertisment.findAll(criteria);
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
        if(!error.statusCode){
            error.statusCode=400;
        }
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