const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
    rating : {
        type:Number,
        min: 1,
        max: 5,
        require: [true,'Not a number']
    },
    user :{
        type:mongoose.Schema.ObjectId,
        ref: 'User',
        require : [true,'Not a number']
    },
    restaurant : {
        type:mongoose.Schema.ObjectId,
        ref:'Restaurant',
        require:true
    },
    reservation : {
        type:mongoose.Schema.ObjectId,
        ref:'Reservation',
        require:true
    },
    comment : {
        type:String,
        maxlength: 100
    }
});

module.exports=mongoose.model('Rating',RatingSchema);