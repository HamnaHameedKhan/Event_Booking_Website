const BookingForm = require('../models/BookingFormModel');
const Event=require('../models/EventModel')
const User=require('../models/UserModel')


exports.bookTicket = async (req, res) => {
  const { fullname, email, phone, tickets, eventId, userId } = req.body;
  console.log(`userId:${userId} ,eventId:${eventId}`)
  console.log(req.body)


  try {
    // Validate input
    if (!fullname || !email || !phone || !tickets) {
      return res.status(400).json({ msg: 'Please fill in all fields' });
    }

    // Verify if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    // Verify if the event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(400).json({ msg: 'Event not found' });
    }

    // Create a new booking
    const bookingForm = new BookingForm({
      fullname,
      email,
      phone,
      tickets,
      eventId,
      userId,
      date: new Date(), // Optionally use Date.now() as default value
    });

console.log(bookingForm)
    await bookingForm.save();
    console.log(bookingForm)

    // Send a success response
    res.status(201).json({
      msg: 'Tickets Booked Successfully',
      bookingId: bookingForm.id,
      confirmationMessage: `Your tickets for ${event.name} have been booked successfully.`,
    });
  } catch (error) {
    console.error("Error:", error.message, error.stack); // Log the error with message and stack trace
    res.status(500).json({ msg: 'Server error' }); // Send a general error message
  }
}

exports.getAllBookings = async (req, res) => {
    try {
      const bookings = await BookingForm.find().populate('eventId','title location time date');
      console.log(bookings)
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ msg: 'Error fetching bookings', error });
    }
  };

  // Controller to fetch bookings for a single user
exports.getUserBookings = async (req, res) => {
    const { id } = req.params;
  
    try {
      const userBookings = await BookingForm.find({  userId: id  }).populate('eventId','title location time date').sort({ 'eventId.date':-1 });;
      // console.log(userBookings);
     
      if (userBookings.length === 0) {
        return res.status(404).json({ msg: 'No bookings found for this user' });
      }
      res.status(200).json(userBookings);
    } catch (error) {
      res.status(500).json({ msg: 'Error fetching user bookings', error });
    }
  };