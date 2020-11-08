const mongoose = require('mongoose');
var LawsuitSchema= mongoose.Schema(
    {
    title:{type: String, required: true},
    current_status: {type: String, default: "pending" },
    role_in_case: {type: String, required: true},
    opponent:{type: String},
    penal_codes_applied: [{type: String}],
    description: {type: String},
    lawsuit_location:{type: String, required: true},
    attachment:{type: String},
    filing_date: {type: Date, default: Date.now },
    opponent_lawyer: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Lawyer'
    },
    lawyer :{       
        type:mongoose.Schema.Types.ObjectId,
        ref:'Lawyer'
    },
    client :{       
        type:mongoose.Schema.Types.ObjectId,
        ref:'Client'
    },
    comments :[{       
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment'
    }],
    date: { type: Date, default: Date.now }
});
    
    module.exports = mongoose.model('Lawsuit', LawsuitSchema);