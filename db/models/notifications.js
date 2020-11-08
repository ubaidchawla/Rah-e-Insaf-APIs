const mongoose = require('mongoose');
var NotificationSchema= mongoose.Schema(
{
    content:{type: String},
    user :{       
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
}, { timestamps: true } );
    
module.exports = mongoose.model('Notification', NotificationSchema);