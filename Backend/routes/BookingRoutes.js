const express=require('express');
const { bookTicket, getAllBookings, getUserBookings } = require('../controllers/BookingFormController');
const router=express.Router();

router.post('/bookTicket',bookTicket)

router.get('/allBookings' ,getAllBookings)

router.get('/userbooking/:id',getUserBookings)

module.exports=router;