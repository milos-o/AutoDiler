const express = require("express");
const publicController = require("../controllers/Public/publicUserController");
const router = express.Router();

//Vraca konkretni oglas po id-u
router.get("/add/:id",publicController.getAddByID);
//Svi oglasi
router.get("/adds",publicController.getAllAdds);
//pretraga
router.get("/adds/search",publicController.getFilteredAdds);
//oglasi odredjenog korisnika
router.get("/adds/:username",publicController.getAddsByUser);




module.exports = router;