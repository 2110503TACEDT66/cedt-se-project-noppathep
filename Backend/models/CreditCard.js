const mongoose = require('mongoose');

const CreditCardSchema = new mongoose.Schema({
    cardNumber: {
        type: String,
        required: true,
        minlength: 16,
        maxlength: 16
      },
      cardholderName: {
        type: String,
        required: true
      },
      expirationDate: {
        type: String,
        required: true
      },
      cvv: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 4
      },
}
);

module.exports=mongoose.model('CreditCard',CreditCardSchema);