const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require ("./routes/jobRoutes");
const employmentRoutes = require ("./routes/employmentRoute");





const app = express();
const port = process.env.PORT || 5000;
const corsOptions = {
  origin: 'http://localhost:3000', // Replace with your frontend's URL
  credentials: true, // Allow credentials (cookies)
};

app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: false}))

app.use(
  session({
    secret: 'shhhhhhhh',
    resave: true,
    saveUninitialized: false,
  })
);

mongoose
  .connect('mongodb://127.0.0.1:27017/Newuser', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB Connected Successfully');
  })
  .catch((err) => {
    console.error('Error connecting to the DB:', err);
  });


//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/job", jobRoutes);
app.use("/api/v1/employment", employmentRoutes);



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
