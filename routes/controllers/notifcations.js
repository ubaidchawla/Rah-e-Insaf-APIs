var express = require('express');

const Notification = require('../../db/models/notifications.js');

// Create and Save a new post
module.exports = {
    findAll : async (req, res) => {
        Notification.find().sort([['date', -1]])
          .then(notifications => {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 2;
      
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
          results = notifications.slice(startIndex,endIndex)
          res.json(results);
        }).catch(err => {
          res.status(500).send({
          message: err.message || "Something went wrong while getting Notifications"
        });
        });
        }
}