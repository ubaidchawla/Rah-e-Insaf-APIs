const mongoose = require('mongoose');
var WalletSchema= mongoose.Schema(
    { 
    amount: {type: Number, required: true},
    user :{       
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    date: { type: Date, default: Date.now }
});
    
    module.exports = mongoose.model('Wallet', WalletSchema);