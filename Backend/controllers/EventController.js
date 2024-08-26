const Event = require('../models/EventModel');
const upload = require('../utils/cloudinary'); // Adjust the path as needed

exports.createEvent = async (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ msg: 'Image upload failed' });
    }

    // Extract fields from req.body and req.file
    const { title, location, date, time, price, description } = req.body;
    const image = req.file.path; // This will give you the URL of the uploaded image

    try {
      // Validate required fields
      if (!title || !location || !date || !time || !price || !description) {
        return res.status(400).json({ msg: 'All fields are required' });
      }

      // Create and save the new event
      const newEvent = new Event({
        title,
        location,
        date,
        time,
        price,
        description,
        image: image // Save the image URL from Cloudinary
      });

      await newEvent.save();

      // Send a success response
      res.status(201).json({
        msg: 'Event created successfully',
        event: newEvent
      });

    } catch (error) {
      // Handle and send error response
      console.error('Error creating event:', error);
      res.status(500).json({ msg: 'Server error' });
    }
  });
};

exports.allEvents=async(req,res)=>{

  try {
    const events= await Event.find();
    res.json(events)
    console.log(events)
  } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({msg:'Server error'})
  }
}

exports.deleteEvent=async(req,res)=>{
  const id=req.params.id;
  console.log(id);

  try {
    const event=await Event.findById(id)

    if(!event){
      return res.status(404).json({msg:'Event not found'})
    }

    await Event.findByIdAndDelete(id)
    console.log('event deleted')
    return res.status(200).json({msg:'event deleted'})
  } catch (error) {
      console.log('Error deleting event:', error);
      return res.status(500).json({msg:'error event deleted'})
  }
}

exports.updateEvent=async(req,res)=>{

  upload.single('image')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ msg: 'Image upload failed' });
    }
    const id=req.params.id;

    const {title, location, date, time, price, description}=req.body;

    if(!title || !location || !date || !time || !price || !description){
      return res.status(400).json({msg:'Please fill in all fields'})
    }
  
    try {
      const event=await Event.findById(id)

      if(!event){
        return res.status(404).json({msg:'Event not found'});
      }
  
      event.title=title;
      event.location=location;
      event.date=date;
      event.time=time;
      event.price=price;
      event.description=description;
  
      if(req.file){
        event.image=req.file.path
      }
  
      await event.save();
      res.status(200).json({msg:'event created sucessfully'})
      
    } catch (error) {
        console.error('Error updating event:', error);
    }
 

  })
}


// to get a single event
exports.singleEvent = async (req, res) => {

  try {
    const singleEvent = await Event.findById(req.params.id);
    if (!singleEvent) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    console.log('event fetched')
    res.json(singleEvent);
  } catch (error) {
    console.error('Error fetching event:', error);
    return res.status(500).json({ msg: 'Error fetching event' });
  }
}

// to get upcoming events
exports.upcomingEvents = async (req, res) => {
  try {
    // Get current date and time
    const now = new Date();
    const nowDate = now.toISOString().split('T')[0]; // YYYY-MM-DD format
    const nowTime = now.toTimeString().substring(0, 5); // HH:MM format

    console.log('Current Date:', nowDate);
    console.log('Current Time:', nowTime);

    // Query for upcoming events
    const upcomingEvents = await Event.find({
      $or: [
        { date: { $gt: nowDate } }, // Dates after today
        {
          $and: [
            { date: { $eq: nowDate } }, // Current date
            { time: { $gte: nowTime } } // Time greater than or equal to current time
          ]
        }
      ]
    }).sort({ date: 1, time: 1 }); // Sort by date and time in ascending order

    res.json(upcomingEvents);
  } catch (error) {
    console.error('Error fetching upcoming events:', error.message);
    res.status(500).json({ msg: 'Error fetching upcoming events' });
  }
};

// Search for events based on title, location, date, or description
exports.searchEvents = async (req, res) => {
  const { searchTerm, location, date } = req.query; // Extract the search query from the request

  try {
    // Build the search criteria (case-insensitive)
    const searchCriteria = {
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } }, // Search by title
        { location: { $regex: location, $options: 'i' } }, // Search by location
      ],
    };

     // If the query can be parsed as a date, add date search criteria
     const parsedDate = Date.parse(date);
     if (!isNaN(parsedDate)) {
       const date = new Date(parsedDate);
       searchCriteria.$or.push({ date: date }); // Exact date match
     }
    // Find events that match the search criteria
    const events = await Event.find(searchCriteria);

    if (events.length === 0) {
      return res.status(404).json({ msg: 'No events found' });
    }

    res.status(200).json(events);
  } catch (error) {
    console.error('Error searching events:', error.message);
    res.status(500).json({ msg: 'Error searching events' });
  }
};


