var express = require('express');
const pdfMake = require('../../pdfmake/pdfmake');
const vfsFonts = require('../../pdfmake/vfs_fonts');

pdfMake.vfs = vfsFonts.pdfMake.vfs;
const Lawsuit = require('../../db/models/lawsuits');
// Create and Save a new lawsuit
module.exports = {

  create : async (req, res) => {
    if(!req.body) {
        return res.status(400).send({
        message: "Please fill all required field"
      });
      }

      // Create a new lawsuit
      const lawsuit = new Lawsuit();
      
        lawsuit.title = req.body.title,
        lawsuit.current_status = req.body.current_status,
        lawsuit.role_in_case = req.body.role_in_case,
        lawsuit.opponent = req.body.opponent,
        lawsuit.penal_codes_applied = req.body.penal_codes_applied,
        lawsuit.description = req.body.description
        lawsuit.lawsuit_location = req.body.lawsuit_location,
        lawsuit.attachment = req.files.attachment[0].location,
        lawsuit.filing_date = req.body.filing_date,
      // Save lawsuit in the database
      await lawsuit.save()
      .then(data => {
        res.send(data);
      }).catch(err => {
        res.status(500).send({
        message: err.message || "Something went wrong while adding a new lawsuit."
      });
      });
    },
    findOne : async (req, res) => {
      Lawsuit.findById(req.params.id)
      .then(lawsuit => {
      if(!lawsuit) {
       return res.status(404).send({
       message: "lawsuit not found with id " + req.params.id
     });
    }
     res.send(lawsuit);
    }).catch(err => {
      if(err.kind === 'ObjectId') {
        return res.status(404).send({
        message: "lawsuit not found with id " + req.params.id
      });
    }
    return res.status(500).send({
      message: "Error getting lawsuit with id " + req.params.id
    });
    });
    },
    
    findAll : async (req, res) => {

        Lawsuit.find()
          .then(lawsuits => {
          res.send(lawsuits);
        }).catch(err => {
          res.status(500).send({
          message: err.message || "Something went wrong while getting lawsuits"
        });
        });
    },
    update : async (req, res) => {
         // Validate Request
  if(!req.body) {
    return res.status(400).send({
    message: "Please fill all required field"
  });
  }
  // Find lawsuit and update it with the request body
  Lawsuit.findByIdAndUpdate(req.params.id, {
    title : req.body.title,
    current_status :req.body.current_status,
    role_in_case : req.body.role_in_case,
    opponent : req.body.opponent,
    penal_codes_applied : req.body.penal_codes_applied,
    description : req.description,
    lawsuit_location : req.body.lawsuit_location,
    attachment : req.file.path,
    filing_date : req.body.filing_date,
  }, {new: true})
  .then(lawsuit => {
   if(!lawsuit) {
     return res.status(404).send({
     message: "lawsuit not found with id " + req.params.id
   });
  }
  res.send(lawsuit);
  }).catch(err => {
  if(err.kind === 'ObjectId') {
    return res.status(404).send({
    message: "lawsuit not found with id " + req.params.id
  });
  }
  return res.status(500).send({
    message: "Error updating lawsuit with id " + req.params.id
  });
  });
  },
  // Delete a lawsuit with the specified id in the request
  delete : async (req, res) => {
    Lawsuit.findByIdAndRemove(req.params.id)
    .then(lawsuit => {
    if(!lawsuit) {
      return res.status(404).send({
      message: "lawsuit not found with id " + req.params.id
    });
    }
    res.send({message: "lawsuit deleted successfully!"});
    }).catch(err => {
    if(err.kind === 'ObjectId' || err.name === 'NotFound') {
      return res.status(404).send({
      message: "lawsuit not found with id " + req.params.id
    });
    }
    return res.status(500).send({
      message: "Could not delete lawsuit with id " + req.params.id
    });
    });
    },

    download : async(req, res) => {
      const lawsuit =await Lawsuit.findOne({_id:"5f55a7dee5e80a2b446938ae"});
      const title = lawsuit.title;
      const current_status = lawsuit.current_status;
      const role_in_case = lawsuit.role_in_case;
      const opponent = lawsuit.opponent;
      const penal_codes_applied = lawsuit.penal_codes_applied;
      const location = lawsuit.lawsuit_location;
      const filing_date = lawsuit.filing_date;
      

      var documentDefinition = {
          content: [
              `Lawsuit : ${title}`,
              `Current Status : ${current_status}`,
              `Role_in_case : ${role_in_case}`,
              `Opponent Lawyer : ${opponent}`,
              `Penal_Codes_Applied : ${penal_codes_applied}`,
              `Lawsuit Location : ${location}`,
              `Filing Date : ${filing_date}`
          ]        
      };

      const pdfDoc = pdfMake.createPdf(documentDefinition);
      pdfDoc.getBase64((data)=>{
          res.writeHead(200, 
          {
              'Content-Type': 'application/pdf',
              'Content-Disposition':'attachment;filename="lawsuits.pdf"'
          });

          const download = Buffer.from(data.toString('utf-8'), 'base64');
          res.end(download);
      });
    },

    count : async (req, res) => {
      Lawsuit.countDocuments(function (err, count) {
        if (err) {
            res.send(err);
            return;
        }
        res.json({ count: count });
    });
    }
}
