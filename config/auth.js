// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth': {
        'clientID': '578322552830734', // App ID
        'clientSecret': 'dd234701e5dd412fb7ddb9a090b35e94', //App Secret
        'callbackURL': 'http://rah-e-insaf-env.eba-kg77uhvd.us-east-1.elasticbeanstalk.com//auth/facebook/callback',
        'profileURL': 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
        'profileFields': ['id', 'email', 'name'] // For requesting permissions from Facebook API
    },

    'googleAuth': {
        'clientID': '71227609772-bc467b0lftodjqsibmialmcqqvpukuj1.apps.googleusercontent.com',
        'clientSecret': '2gOpPrQ_oU3V0vNiW3m7fvhs',
        'callbackURL': 'http://localhost:5000/auth/google/callback'
    }

};