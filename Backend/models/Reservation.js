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
    }],
    paid:{
        type:Boolean,
        default:false
    }
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

module.exports=mongoose.model('Reservation',ReservationSchema);