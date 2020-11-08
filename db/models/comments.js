const mongoose = require('mongoose');
var CommentSchema= mongoose.Schema(
    {
    content :{       
        type:String,
        required: true
    },
    attachment:{type: String},
    post :{       
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    },
    hearing :{       
        type:mongoose.Schema.Types.ObjectId,
        ref:'Hearing'
    },
    lawsuit :{       
        type:mongoose.Schema.Types.ObjectId,
        ref:'Lawsuit'
    },
    user :{       
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    date: { type: Date, default: Date.now }
});
    
    module.exports = mongoose.model('Comment', CommentSchema);