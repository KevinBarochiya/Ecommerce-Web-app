const mongoose = require('mongoose');

// Replace <your_database_name> with your actual database name
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://myone:Kevin123@cluster0.cbj7p.mongodb.net/mega?ssl=true&replicaSet=atlas-142tsx-shard-0&authSource=admin&retryWrites=true&w=majority';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

module.exports = mongoose.connection;
