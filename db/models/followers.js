const mongoose = require('mongoose');
var FollowerSchema= mongoose.Schema(
    {
    fullname:{type: String, required: true},
    email: {type: String, required: true},
    phone: {type: Number, required: true},
    user :{       
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    date: { type: Date, default: Date.now }
});
    
    module.exports = mongoose.model('Follower', FollowerSchema);