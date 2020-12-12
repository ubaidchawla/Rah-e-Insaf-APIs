const express = require('express')
const router = express.Router()
const authController = require('./controllers/phone_auth');
const lawyerController = require('./controllers/lawyers');
const clientController = require('./controllers/clients');
const postController = require('./controllers/posts');
const commentController = require('./controllers/post_comments');
const lawController = require('./controllers/laws');
const lawsuitController = require('./controllers/lawsuits');
const categoryController = require('./controllers/categories');
const subcategoryController = require('./controllers/sub_categories');
const appraisalController = require('./controllers/appraisals');
const consultationController = require('./controllers/consultations');
const hearingController = require('./controllers/hearings')
const commenthearingController = require('./controllers/hearing_comments')
const commentlawsuitController = require('./controllers/lawsuit_comments')
const userController = require('./controllers/users')
const adminController = require('./controllers/admin')
const passport = require('passport');


const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const multer = require('multer');
const s3 = new aws.S3({
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.ACCESSKEYSECRET,
    region: 'us-east-2'
});


    var upload = multer({
        storage: multerS3({
            s3: s3,
            bucket: 'raheinsaf',
            key: (req, file, cb)=>{
                if(file.fieldname==="document")
                {
                if (
                        file.mimetype === 'application/pdf' ||
                        file.mimetype === 'application/msword' ||
                        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                    ) { // check file type to be pdf, doc, or docx
                        console.log(file);
                        cb(null, './uploads/documents/' + file.originalname)
                    } else {
                        cb(null, false); // else fails
                    }
                }
                else if(file.fieldname==="image")
                {
                    if (
                        file.mimetype === 'image/png' ||
                        file.mimetype === 'image/jpg' ||
                        file.mimetype === 'image/jpeg'||
                        fiel.mimetype==='image/gif'
                    ) { // check file type to be png, jpeg, or jpg
                        console.log(file);
                        cb(null, './uploads/images/' + file.originalname)
                    } else {
                        cb(null, false); // else fails
                    }
                }
            }
        })
    });


//ROUTES FOR AUTH
router.post('/login/phone', authController.login);
router.post('/register/phone', authController.register);
router.post('/verify', authController.verify);
// -------------------------------------------------------------------------------------------------

    // Get all users
    router.get('/users', userController.findAll);
    // Create a new lawyer
    router.post('/lawyer/register', lawyerController.create);
    //GET ALL LAYWERS
    router.get('/lawyers', lawyerController.findAll);
    // Retrieve a single lawyer details with id
    router.get('/lawyer/:id', lawyerController.findOne);
    //edit Lawyer
    router.put('/lawyer/edit/:id', lawyerController.update);
    // Remove an Lawyer
    router.delete('/lawyer/:id', lawyerController.delete);
    //Bookmark a lawyer
    router.post('/lawyer/:lawyerId/bookmark', lawyerController.bookmark);
    // Get bookmarked Lawyers
    router.get('/bookmark/lawyers', lawyerController.bookmarked);
    // Remove a bookmark
    router.delete('/bookmark/lawyer/:id', lawyerController.bookmarkremove);
    //Follow a lawyer
    router.post('/lawyer/:lawyerId/follow', lawyerController.follow);
    // Get bookmarked Lawyers
    router.get('/following', lawyerController.following);
    //Count Lawyers
    router.get('/lawyers/count', lawyerController.count);

    //update lawyer details
    router.put('/lawyer/:id', lawyerController.update);
    // Remove a bookmark
    router.delete('/unfollow/lawyer/:id', lawyerController.unfollow);

    // Get Lawyer POSTS
    router.get('/posts/:lawyerId', postController.lawyerPosts);
    //ADD Appraisal for the Lawyer
    router.post('/appraisal/:lawyerId/create', appraisalController.create);
    // Get All Appraisals for the Lawyer
    router.get('/appraisals', appraisalController.findAll);
    // Get Appraisal Details
    router.get('/appraisal/:lawyerId', appraisalController.findOne);

// ---------------------------------------------------------------------------------------------------

    //Load the feed
    router.get('/feed', postController.findAll);

//---------------------------------------------------------------------------------------------------

    //create a POST
    router.post('/post/:lawyerId/create',upload.fields(
        [
            {
            name:'document',
            maxCount:1
            },
            {
            name:'image',
            maxCount:1
            }
        ]), postController.create);
    // Get Post Details
    router.get('/post/:postId', postController.findOne);
    // Get Post Details
    router.get('/posts', postController.findAll);
    // Delete Post
    router.delete('/post/:id', postController.delete);
    //Bookmark a Post
    router.post('/post/:postId/bookmark', postController.bookmark);
    // Get bookmarked Posts
    router.get('/bookmark/posts', postController.bookmarked);
    // Remove a bookmark
    router.delete('/bookmark/post/:id', postController.bookmarkremove);

//---------------------------------------------------------------------------------------------------

    //ADD a Comment to a post
    router.post('/comment/:postId/create', upload.single('attachment'),commentController.create);
    //ADD a Comment to hearing
    router.post('/comment/:hearingId/create', upload.single('attachment'),commenthearingController.create);
    //ADD a Comment to Lawsuit Discussion
    router.post('/comment/:lawsuitId/create', upload.single('attachment'),commentlawsuitController.create);
    //Get all lawsuit discussion comments
    router.get('/comments/lawsuits', upload.single('attachment'),commentlawsuitController.findAll);

    // Delete Comment
    router.delete('/comment/:id', commentController.delete);

    //---------------------------------------------------------------------------------------------------

    // Get Clients
    router.get('/clients', clientController.findAll);
    // Get Client Details
    router.get('/client/:clientId', clientController.findOne);
    //create Client
    router.post('/client/:userId/create', clientController.create);
    // count clients
    router.get('/clients/count',clientController.count);
//---------------------------------------------------------------------------------------------------

    // Get Laws
    router.get('/laws', lawController.findAll);
    router.get('/lawdetails', lawController.lawdetails);
    // Get Law Details
    router.get('/law/:lawId', lawController.findOne);
     //edit Law
     router.put('/law/edit/:id', lawController.update);
    // Remove an Law
    router.delete('/law/:id', lawController.delete);
    // Get Law Categories
    router.get('/categories', categoryController.findAll);
    // Get Law Sub-Categories
    router.get('/sub-categories', subcategoryController.findAll);
    //create Law
    router.post('/law/create', lawController.create);
    //create Category
    router.post('/category/create', categoryController.create);
    //edit category
    router.put('/category/edit/:id', categoryController.update);
    //create Sub Category
    router.post('/subcategory/create', subcategoryController.create);
     //edit subcategory
     router.put('/subcategory/edit/:id', subcategoryController.update);
    //delete sub Category
    router.delete('/subcategory/:id', subcategoryController.delete);
    //delete Category
    router.delete('/category/:id', categoryController.delete);
    // Bookmark a Law
    router.post('/law/:lawId/bookmark', lawController.bookmark);
    // Get bookmarked Laws
    router.get('/bookmark/laws', lawController.bookmarked);
    // Remove a bookmark
    router.delete('/bookmark/law/:id', lawController.bookmarkremove);

//---------------------------------------------------------------------------------------------------

    // Get Lawsuits
    router.get('/lawsuits', lawsuitController.findAll);
    // Get Lawsuit Details
    router.get('/law/:lawId', lawsuitController.findOne);
    //create Lawsuit
    router.post('/lawsuit/create', upload.fields(
        [
            {
            name:'attachment',
            maxCount:5
            }
        ]),lawsuitController.create);
    //update lawsuit
    router.put('/lawsuit/:id', lawsuitController.update);
    //download lawsuits
    router.get('/lawsuits/download', lawsuitController.download);
    //delete lawsuit
    router.delete('/lawsuit/:id', lawsuitController.delete);
    // count lawyers
    router.get('/lawsuits/count',lawsuitController.count);
//---------------------------------------------------------------------------------------------------

    // Make a Consultation Request
    router.post('/consultation/:lawyerId/create',consultationController.create);
    // View Details of Consultation
    router.get('/consultation/:lawyerId',consultationController.findOne);
    // Approve Consultation Request
    router.get('/consultation/approve/:consultationId',consultationController.approve);
    // Reject Consultation Request
    router.get('/consultation/reject/:consultationId',consultationController.reject);
    // View Details of Consultation
    router.get('/consultation/:lawyerId',consultationController.findOne);
    // Get List of consultations
    router.get('/consultations',consultationController.findAll);
    // Remove a consultation
    router.delete('/consultation/:id', consultationController.delete);
    // count consultations
    router.get('/consultations/count',consultationController.count);
    // count accepted consultations
    router.get('/consultations/finished',consultationController.countfinished);
    //count pending requests
    router.get('/consultations/requests',consultationController.countrequests);
    //count rejected requests
    router.get('/consultations/rejected',consultationController.countrequests);   
    // total revenue by consultations
    router.get('/revenue',consultationController.revenue);

//---------------------------------------------------------------------------------------------------

    // Get hearings
    router.get('/hearings', hearingController.findAll);
    // Get hearing Details
    router.get('/hearing/:hearingId', hearingController.findOne);
    //create hearing
    router.post('/hearing/:id/create', hearingController.create);
    // Remove a hearing
    router.delete('/hearing/:id', hearingController.delete);
    // Get Lawsuit Hearings
    router.get('/hearings/:lawsuitId', hearingController.lawsuitHearings);

//---------------------------------------------------------------------------------------------------
// Admin Routes
       // Get admins
    router.get('/admins', adminController.findAll);
    // Get admin Details
    router.get('/admin/:adminId', adminController.findOne);
    //create admin
    router.post('/admin/create',upload.fields(
        [
            {
            name:'image',
            maxCount:1
            }
        ]), adminController.create);
        //edit admin
     router.put('/admin/edit/:id', adminController.update);
    // Remove an Admin
    router.delete('/admin/:id', adminController.delete);
//---------------------------------------------------------------------------------------------------
    // Test Routes
    router.get('/profile',(req,res)=>{
        if (req.user.google.name)
            res.send('Login Successful by '+req.user.google.name+"And User id is "+req.user._id);
        else if (req.user.facebook.name)
            res.send('Login Successful by '+req.user.facebook.name);
        else (req.user.local.name)
        res.send('Login Successful by '+req.user.local.name);
    })
    router.get('/check',(req,res)=>{
        console.log(req.user._id)
        console.log(req.user.google.name)
    })

//---------------------------------------------------------------------------------------------------

    // LOGIN
    router.get('/login', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.send('login page');
    });

    // process the login form
    router.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));
    
//---------------------------------------------------------------------------------------------------

    // SIGNUP 
    // show the signup form
    router.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists

        res.send('signup page');

    });

    // process the signup form
    router.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));
    
//---------------------------------------------------------------------------------------------------

    // FACEBOOK ROUTES 
    router.get('/auth/facebook', passport.authenticate('facebook', {
        scope: ['public_profile', 'email']
    }));

    // handle the callback after facebook has authenticated the user
    router.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/profile',
            failureRedirect: '/'
        }));

//---------------------------------------------------------------------------------------------------

    // GOOGLE ROUTES 
    router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

    // the callback after google has authenticated the user
    router.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/profile',
            failureRedirect: '/'
        }));
//---------------------------------------------------------------------------------------------------
module.exports = router;