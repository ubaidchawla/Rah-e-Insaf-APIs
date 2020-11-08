const mongoose = require('mongoose');
var TransactionSchema= mongoose.Schema(
    {
    payment_method:{type: String, required: true},
    user_id: {type: String, required: true},
    password: {type: String, required: true},
    phone: {type: Number, required: true},
    user :{       
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    date: { type: Date, default: Date.now }
});
    
    module.exports = mongoose.model('Transaction', TransactionSchema);