const mongoose = require('mongoose');

// Replace <your_database_name> with your actual database name
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://kevinbarochiya1:tHPE1z3rXa83qpf3@cluster0.v0wuq.mongodb.net/mega?retryWrites=true&w=majority';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

module.exports = mongoose.connection;
