const express = require('express');
const subscribersRouter = require('./routes/subscribers.router');
const usersRouter = require('./routes/users.router');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const compression = require('compression');
const port = process.env.PORT || 4000

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

//mongodb stuff
const uri = "mongodb+srv://dbUser:dbUserPassword@cluster0.k7dtj.mongodb.net/Cluster0?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true,
  useFindAndModify: false, useCreateIndex: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected to mongodb')
});
function shouldCompress (req, res) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false
  }

  // fallback to standard filter function
  return compression.filter(req, res)
}

app.use('/', express.static(path.join(__dirname, '../client/dist/weather-app')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use('/subscribers', subscribersRouter);
app.use('/users', usersRouter);
app.use(compression({ filter: shouldCompress }))

module.exports = app;
