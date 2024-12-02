const express = require('express');
const {createTicket, getTickets, updateTicketStatus} = require('../controllers/ticketController');
const authMiddleWare = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const router = express.Router();

router.post('/createTicket',authMiddleWare, roleMiddleware(['Customer']),createTicket);
router.get('/getTickets',authMiddleWare,getTickets);
router.patch('/updateTicketStatus', authMiddleWare, roleMiddleware(['Agent','Admin']), updateTicketStatus);

module.exports = router;

