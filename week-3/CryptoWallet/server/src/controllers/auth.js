const User = require("../models/user");

const auth = async (req,res) => {
    const email = req.body.email;
    const name = req.body.name;

    try {
        const user = await User.findOne({email});

        if(user) {
            res.status(201).send("User already exsits!");
        } else {
            const newUser = await User({email, name});
            newUser.save();
            res.status(200).send("Account created successfully");
        }

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
};

module.exports = auth;