require('dotenv').config();
  const express = require('express');
  const mongoose = require('mongoose');
  const userRoutes = require('./routes/userRoutes');
  
  const app = express();
  
  app.use(express.json());
  app.use('/api/user', userRoutes);
  
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  
  // MongoDB connection
  mongoose.connect(process.env.MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true,createIndexes: true})
      .then(() => console.log('Connected to MongoDB'))
      .catch(err => console.log('Could not connect to MongoDB', err));
  
  // Export app for unit testing
  module.exports = app;
  