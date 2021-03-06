const { Model } = require('sequelize');
const Advertisment = require('../../models/Advertisment');
const Sequelize = require('sequelize');
const User = require('../../models/User');
const Images = require('../../models/Images');
const CarModel=require('../../models/Model');
const Brand=require('../../models/Brand');
const Comment=require('../../models/Comment');
const Contact = require('../../models/Contact');
const Category = require('../../models/Category');
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
                include:[{
                    model:Brand,
                    attributes: ["id","name"],
                    
                },
                {
                    model:Category,
                    attributes:["id","name"],
 
                }
                ]
            },
            {
                model:User,
                required:true,
                attributes:["id","name","email"],
            },
            {
                model:Images,
                attributes:["path"]
            },
        ],
        })
        if(!add){
            let err = new Error("Add doesnt exist");
            err.statusCode=404;
            next(err);
        }
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
            include:[{      
                model:CarModel,
                attributes: ["id","name"],
                include:[{
                    model:Brand,
                    attributes: ["id","name"],    
                },
                {
                    model:Category,
                    attributes:["id","name"],
                }
            ]
            },
                {
                    model:User,
                    required:true,
                    attributes:["id","name","email"]
                    
                },
                {
                    model:Images,
                    attributes:["path"]
                },
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
    let userId=req.params.userId;
    try {
        let adds = await Advertisment.findAll({
            where:{
                userId: userId
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
                },
                {
                    model:Images,
                    attributes:["path"]
                },
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
    let where4={};
    
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

    if(req.query.minKw && req.query.maxKw){
        where1['kw']={
            [Op.between]:[req.query.minKw,req.query.maxKw]
        }
    }else if(req.query.minKw){
        where1['kw']={
            [Op.gte]:req.query.minKw
         }
    }else if(req.query.maxKw){
        where1['kw']={
            [Op.lte]:req.query.maxKw
         }
    }

    if(req.query.minMileage && req.query.maxMileage){
        where1['mileage']={
            [Op.between]:[req.query.minMileage,req.query.maxMileage]
        }
    }else if(req.query.minMileage){
        where1['mileage']={
            [Op.gte]:req.query.minMileage
         }
    }else if(req.query.maxMileage){
        where1['mileage']={
            [Op.lte]:req.query.maxMileage
         }
    }

    if(req.query.transsmision){
        where1['transsmision']=req.query.transsmision
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
    if(req.query.categoryId){
        where4["categoryId"]=req.query.categoryId;
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
                    include:[{
                        model:Brand,
                        attributes: ["id","name"],
                        where:where2,
                        
                    },
                    {
                        model:Category,
                        attributes:["id","name"],
                        where:where4,
                    }
                ],
                    where:where3,
                },
                {
                    model:User,
                    required:true,
                    attributes:["id","name","email"],
                    
                },
                {
                    model:Images,
                    attributes:["path"]
                },
            ],
            
        }
        
        let totalAdds = await Advertisment.count(criteria);  
        
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
        let criteria={
            where:{
                advertismentId:id,
            },
            attributes:{exclude:["advertismentId","userId"]},
            include:{
                model:User,
                required:true,
                attributes:["id","name","email"],
            }
        };
        let totalComments = await Comment.count(criteria);
        
        let pageNumber = req.query.page;
        if(!pageNumber) pageNumber=1;
        
        criteria.limit=20;
        criteria.order=[['createdAt','DESC']];
        criteria.offset=((pageNumber-1)*20);
        let comments = await Comment.findAll(criteria);
        
        let result = {
            comments: comments,
            total: totalComments
        };
        res.status(200).json(result);
    } catch (error) {
        if(!error.statusCode){
            error.statusCode=400;
        }
        next(error);
    }
}

async function postContactForm(req,res,next){
    let id = req.params.addId;
    try {
        let question = await Contact.create({
            name:req.body.name,
            phone:req.body.phone,
            email:req.body.email,
            message:req.body.message,
        });
        res.status(200).json("Your question is sent!");
    } catch (error) {
        if(!error.statusCode){
            error.statusCode=400;
        }
        next(error);
    }

}
async function getModelByBrandAndCategory(req,res,next){
    let where1={};
    if(req.query.brandId) where1["brandId"]=req.query.brandId
    if(req.query.categoryId) where1["categoryId"]=req.query.categoryId
   
    try {
        
        let result = await CarModel.findAll({
           where: where1
        });

        res.status(200).json(result);
    } catch (error) {
        if(!error.statusCode){
            error.statusCode=400;
        }
        next(error);
    }

}

async function getBrands(req,res,next){
    try {
        
        let result = await Brand.findAll();

        res.status(200).json(result);
    } catch (error) {
        if(!error.statusCode){
            error.statusCode=400;
        }
        next(error);
    }
}
async function getCategories(req,res,next){
    try {
        
        let result = await Category.findAll();

        res.status(200).json(result);
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
    getAddComments,
    postContactForm,
    getModelByBrandAndCategory,
    getBrands,
    getCategories

}