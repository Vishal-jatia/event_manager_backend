const User = require("../models/user");

const updateUser = async (req, res) => {
    console.log("Update user service started");
    
    try {
        const regNumber = req.body.reg_number;

        const existingUser = await User.findOne({ reg_number: regNumber });
        if (!existingUser) {
            return res.status(404).send({ message: "User not found" });
        }

        const updateData = {
            reg_number: regNumber,
            username: req.body.username || existingUser.username,
            email: req.body.email || existingUser.email,
            contactNumber: req.body.contactNumber || existingUser.contactNumber,
            registeredEvents:
                req.body.registeredEvents || existingUser.registeredEvents,
        };

        const updatedUser = await User.findOneAndUpdate(
            { reg_number: regNumber },
            updateData,
            { new: true }
        );

        console.log("Update user service ended");
        res.status(200).send(updatedUser);
    } catch (err) {
        console.error(err);
        console.log("Update user service ended");
        res.status(500).send({ message: "Server error" });
    }
};

module.exports = {
    updateUser,
};  