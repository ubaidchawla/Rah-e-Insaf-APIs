const mongoose = require('mongoose');
var PostSchema= mongoose.Schema(
    {
    description:{type: String},
    document_url:{type: String},
    image_url:{type: String},

    bookmarks: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    lawyer :{       
        type:mongoose.Schema.Types.ObjectId,
        ref:'Lawyer'
    },
    comments :[{       
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment'
    }],
    bookmarks :[{       
        type:mongoose.Schema.Types.ObjectId,
        ref:'Bookmarks'
    }],
    date: { type: Date, default: Date.now }
    });
    
    module.exports = mongoose.model('Post', PostSchema);