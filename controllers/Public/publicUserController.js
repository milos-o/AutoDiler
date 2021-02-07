const Advertisment = require('../../models/Advertisment');


async function getAddByID(req,res){
    let id = req.params.id;
    try {        
        let add = await Advertisment.findByPk(id);
        res.status(200).json(add);
    } catch (error) {
        res.status(400).json(error);
    }
}

async function getAllAdds(req,res){
    let id = req.params.id;
    try {        
        let adds = await Advertisment.findAll();
        res.status(200).json(adds);
    } catch (error) {
        res.status(400).json(error);
    }
}
async function getAddsByUser(req,res){

}

async function getFilteredAdds(req,res){

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