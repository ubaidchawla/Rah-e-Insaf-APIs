const mongoose = require('mongoose');
var ConversationSchema= mongoose.Schema(
    {
    lawsuit :{       
        type:mongoose.Schema.Types.ObjectId,
        ref:'Lawsuit'
    },
    date: { type: Date, default: Date.now }
});
    
    module.exports = mongoose.model('Conversation', ConversationSchema);