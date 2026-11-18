const express = require("express");
const router = express.Router();

const moviesController = require("../controllers/movies.controller.js")

router.get("/", moviesController.list);

router.get("/:id", moviesController.findById);
router.post("/", moviesController.create);
router.put("/:id", moviesController.update);
router.patch("/:id", moviesController.patch);
router.delete("/:id", moviesController.remove);


module.exports = router;