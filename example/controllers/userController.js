const User = require('../models/userModel');
  const bcrypt = require('bcryptjs');
  const jwt = require('jsonwebtoken');
  
  exports.register = async (req, res) => {
    try {
      const { email, password, phoneNumber} = req.body;
      const user = await User.create({ email, password, phoneNumber});
      // create a token for the user
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      // Saving the token in DB for SSO
      user.token = token;
      user.lastLogin = new Date();
      await user.save();
      res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
      res.status(500).json({ error:error, message: error.message });
    }
  };
  
  exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      // Saving the token in DB for SSO
      user.token = token;
      user.lastLogin = new Date();
      await user.save();
      res.status(200).json({ message: "Logged in successfully", token: token });
    } catch (error) {
  
      res.status(500).json({ error: error, message: error.message });
    }
  };
  