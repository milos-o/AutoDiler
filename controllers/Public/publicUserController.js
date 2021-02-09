const { Model } = require('sequelize');
const Advertisment = require('../../models/Advertisment');


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
        let adds = await Advertisment.findAll();
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
            include:{
                model: User,
                where:{
                    name: username
                }
                
            }
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