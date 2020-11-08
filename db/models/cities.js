const mongoose = require('mongoose');
var CitySchema= mongoose.Schema(
    {
    name:{type: String, required: true},
    date: { type: Date, default: Date.now }
});
    
    module.exports = mongoose.model('City', CitySchema);