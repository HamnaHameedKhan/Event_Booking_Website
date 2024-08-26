const express=require('express')
const router=express.Router()
const {createEvent,allEvents, deleteEvent, updateEvent, singleEvent, upcomingEvents, searchEvents}=require('../controllers/EventController')



router.post('/create', createEvent);

router.get('/allEvents',allEvents)

router.delete('/delete/:id' , deleteEvent)

router.put('/update/:id' , updateEvent)

router.get('/singleEvent/:id' , singleEvent)

router.get('/upcoming-events' ,upcomingEvents)

router.get('/searchEvents',searchEvents)


module.exports=router