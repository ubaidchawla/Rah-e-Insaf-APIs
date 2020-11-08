const mongoose = require('mongoose');
var EvidenceSchema= mongoose.Schema(
    {
    attachment:{type: String, required: true},
    lawsuit :{       
        type:mongoose.Schema.Types.ObjectId,
        ref:'Lawsuit'
    },
    date: { type: Date, default: Date.now }
});
    
    module.exports = mongoose.model('Evidence', EvidenceSchema);