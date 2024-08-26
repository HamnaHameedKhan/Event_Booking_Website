const mongoose=require('mongoose')

const BookingFormSchema=new mongoose.Schema({
    // id:{type:String,required:true},
    fullname:{type:String,required:true},
    email:{type:String,required:true},
    phone:{type:String,required:true},
    tickets:{type:Number,required:true},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },



},{timestamps:true})

const BookingForm=mongoose.model('Booking',BookingFormSchema);
module.exports=BookingForm;