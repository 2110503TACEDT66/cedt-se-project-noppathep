const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true,'Please add a name'],
        unique: true,
        trim:true,
        maxlength:[50,'Name can not be more than 50 charector']
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        required: [true, 'Please add owner'],
        unique: false
    },
    address:{
        district:{type:String,required: [true,'Please add a district']},
        province:{type:String,required: [true,'Please add a province']},
        postalcode:{type:String,required: [true,'Please add a postalcode'],maxlength:5},
        region:{type:String,required: [true,'Please add a region']}
    },
    tel:{
        type:String,
        required: [true,'Please add an telephone number'],
        length:[10,'Name can not be more or less than 10 charector']
    },
    openingHours: {
        open: { 
            type: String, 
            required: true,
            validate: {
                validator: function(value) {
                    return value !== this.openingHours.close; // Check if opening time is not equal to closing time
                },
                message: 'Opening time cannot be the same as closing time'
            },
            match: /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/
        },
        close: { 
            type: String, 
            required: true,
            validate: {
                validator: function(value) {
                    return value !== this.openingHours.open; // Check if closing time is not equal to opening time
                },
                message: 'Closing time cannot be the same as opening time'
            },
            match: /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]||24:00$/
        }
    },
    averageRating:{ //misspell
        type:Number,
        default : 0
    }
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

RestaurantSchema.virtual('reservations',{
    ref:'Reservation',
    localField:'_id',
    foreignField:'restaurant',
    justOne:false
});

RestaurantSchema.virtual('menus',{
    ref:'Menu',
    localField:'_id',
    foreignField:'restaurant',
    justOne:false
});

RestaurantSchema.virtual('tables',{
    ref:'Table',
    localField:'_id',
    foreignField:'restaurant',
    justOne:false
});

RestaurantSchema.virtual('rating',{
    ref:'Rating',
    localField:'_id',
    foreignField:'restaurant',
    justOne:false
});

RestaurantSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    console.log(`All Reservation being removed from restaurant ${this._id}`);
    await this.model('Reservation').deleteMany({ restaurant: this._id });
    console.log(`All menus being removed from restaurant ${this._id}`);
    await this.model('Menu').deleteMany({ restaurant: this._id });
    console.log(`All Ratings being removed from restaurant ${this._id}`);
    await this.model('Rating').deleteMany({ restaurant: this._id });
    next();
});





module.exports=mongoose.model('Restaurant',RestaurantSchema);