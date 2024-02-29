const mongoose = require('mongoose');
  const bcrypt = require('bcryptjs');
  
  const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: Number, required: true, unique: true },
    password: { type: String, required: true },
    // Saving the token in DB for SSO
    token: { type: String },
    // reset password token for reset password
    resetPasswordToken: { 
        otp: { type: String },
        expires: { type: Date }
     },
    lastLogin: { type: Date }
},
{ timestamps: true}
);
  
  userSchema.pre('save', async function(next) {
      if (!this.isModified('password')) return next();
      this.password = await bcrypt.hash(this.password, 12);
      next();
  });
  
  module.exports = mongoose.model('User', userSchema);
  