const router = require('express').Router();
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

router.post("/", async (req, res) => {
   try{
      const {email, password, passwordVerify} = req.body;

      // Validation
      // Checks to see if the user gave all the required info
      if(!email || !password || !passwordVerify)
         return res
            .status(400)
            .json({errorMessage: "Email or password missing"});
      // Checks to see if the user entered a password longer than 6 characters
      if(password.length < 6)
         return res
            .status(400)
            .json({errorMessage: "Please enter a longer password"});
      // Checks to see if the password and the passwordVerify match
      if(password !== passwordVerify)
         return res
            .status(400)
            .json({errorMessage: "Please enter the same password twice"});
      // Checks to see if there is already an account with the entered email
      const existingUser = await User.findOne({email: email});
      if(existingUser)
         return res
            .status(400)
            .json({errorMessage: "An account with that email already exists"});

      // Hash the password
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);
      
      // Save a new account to database
      const newUser = new User({
         email: email, 
         passwordHash: passwordHash
      });
      const savedUser = newUser.save();

   }catch(err){
      console.error(err);
      res.status(500).send();
   }
});

module.exports = router;