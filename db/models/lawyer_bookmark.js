const mongoose = require('mongoose');
var LawyerBookmark= mongoose.Schema(
    {
    lawyer :{       
        type:mongoose.Schema.Types.ObjectId,
        ref:'Lawyer'
    },
    user :{       
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    date: { type: Date, default: Date.now }
});
    
    module.exports = mongoose.model('LaywerBookmark', LawyerBookmark);