// routes/Room.route.js
const express = require('express');
const { createRoom, getAllRooms, getRoomById, updateRoom, deleteRoom, checkAvailability, upload } = require('../controllers/Room.controller');
const router = express.Router();

router.post('/', upload.single('picture'), createRoom); // Use multer for single file upload (picture)
router.put('/:id', upload.single('picture'), updateRoom); // Optional update of room picture
router.get('/', getAllRooms);
router.get('/:id', getRoomById);
router.delete('/:id', deleteRoom);
router.post('/availability', checkAvailability);

module.exports = router;
