const mongoose = require('mongoose');
const Restaurant  = require('../models/Restaurant');

const ReservationSchema = new mongoose.Schema({
    apptDate:{
        type:Date,
        require:true
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        require :true
    },
    restaurant:{
        type:mongoose.Schema.ObjectId,
        ref:'Restaurant',
        require:true
    },
    foodOrder: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Menu'
      }],
    createdAt:{
        type:Date,
        default:Date.now
    },
    reserveTable : [{
        type: mongoose.Schema.ObjectId,
        ref: 'Table'
    }]
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

ReservationSchema.methods.addTable = function(tableId) {
    this.reserveTable.push(tableId);
    return this.save();
};

ReservationSchema.methods.removeTable = function(tableId) {
    const index = this.reserveTable.indexOf(tableId);
    if (index !== -1) {
        this.reserveTable.splice(index, 1);
    }
    return this.save();
};

ReservationSchema.methods.addItem = function(menuItemId) {
    this.foodOrder.push(menuItemId);
    return this.save();
};

ReservationSchema.methods.removeItem = function(menuItemId) {
    const index = this.foodOrder.indexOf(menuItemId);
    if (index !== -1) {
        this.foodOrder.splice(index, 1);
    }
    return this.save();
};

ReservationSchema.virtual('rating', {
    ref:'Rating',
    localField:'_id',
    foreignField:'reservation',
    justOne: true
});

ReservationSchema.pre('deleteOne',{document:true,query:false},async function(next){
    console.log(`All Rating being remove from reservation ${this._id}`);
    await this.model('Rating').deleteOne({reservation:this._id});
     //update Restaurant.rating
        const RestaurantRate = await Restaurant.findById(this.restaurant).populate('rating');
        console.log(RestaurantRate.averageRating);
        let totalRating = 0;
        RestaurantRate.rating.forEach(rate => {
            totalRating += rate.rating;
        });
        const averageRating = totalRating / RestaurantRate.rating.length;
        
        const newRestaurantRate = await Restaurant.findByIdAndUpdate(
            this.restaurant,
            {averageRating:averageRating.toFixed(2)},
        {
            new:true,
            runValidator:true
        });
        console.log(newRestaurantRate.averageRating);
    // 
    next();
});


module.exports=mongoose.model('Reservation',ReservationSchema);