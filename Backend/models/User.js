const mongoose=require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please add a name']
    },
    telephone:{
        type:String,
        required:[true,'Please enter your phone number'],
        minlength: [10, 'This is not a phone number'],
        maxlength: [10, 'This is not a phone number']
    },
    email:{
        type: String,
        required:[true,'Please add an email'],
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please add a valid email'
        ]
    },
    card: {
        id : {type:String, required:false},
        cardNumber: {type:String, required:false, maxlength:16},
        cardHolder: {type:String, required:false},
        cardExpMonth: {type:String, required:false},
        cardExpYear: {type:String, required:false},
        cardCVV: {type:String, required:false},
    },
    points: {
        type: Number,
        default: 0,
        required: false,
    },
    role: {
        type:String,
        enum: ['user', 'owner','admin'],
        default: 'user'
    },
    password: {
        type:String,
        required:[true,'Please add a password'],
        minlength: 6,
        select: false
    },
        resetPasswordToken: String,
        resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default:Date.now
    }
    });

UserSchema.pre('save',async function(next){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
});

UserSchema.methods.getSignedJwtToken= function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRE
    });
}
UserSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

module.exports=mongoose.model('User',UserSchema);