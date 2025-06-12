const router = require("express").Router();
const roomsController = require("../controller/roomsController");
router.get("/", roomsController.getRooms);
router.get("/sort", roomsController.sortRooms);
router.get("/:_id", roomsController.getRoom);
module.exports = router;
