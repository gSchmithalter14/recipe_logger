const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');

dotenv.config({ path: './config.env' });

colors.setTheme({
  error: ['red', 'bold', 'underline'],
  serverConnected: ['yellow', 'bold'],
  dbConnected: ['cyan', 'underline', 'bold']
});

const app = require('./app');

// Mongoose setup
const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  });

  console.log(`MongoDB Connected: ${conn.connection.host}`.dbConnected);
};

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`.serverConnected);
});
