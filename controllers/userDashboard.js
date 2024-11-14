const User = require("../models/user");

const userDetails = async (req, res) => {
    console.log("User dashboard service started");
    
    user_id = req.body.user_token;

    User.find({ user_token: user_id }, async function (err, docs) {
        if (err) {
            console.log("User dashboard service ended");
            
            console.log(err);
        } else {
            console.log("User dashboard service ended");
            
            res.status(200).send(docs[0]);
        }
    });
};

module.exports = {
    userDetails,
};
