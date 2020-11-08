const mongoose = require('mongoose');
var MessageSchema= mongoose.Schema(
    {
    user :{       
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    conversation :{       
        type:mongoose.Schema.Types.ObjectId,
        ref:'Conversation'
    },
    date: { type: Date, default: Date.now }
});
    
    module.exports = mongoose.model('Message', MessageSchema);