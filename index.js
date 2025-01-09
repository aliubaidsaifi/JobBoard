const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const session = require('express-session');
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require ("./routes/jobRoutes");
const employmentRoutes = require ("./routes/employmentRoute");
const emailRoute = require('./routes/emailRoute')
const path = require("path");
const dotenv = require('dotenv');
dotenv.config();


const app = express();
const port = process.env.PORT || 5000;
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000' , // Replace with your frontend's URL
  credentials: true, // Allow credentials (cookies)
};

app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: false}))

app.use(
  session({
    secret: process.env.REFRESH_TOKEN_SECRET,
    resave: true,
    saveUninitialized: false,
  })
);

mongoose
  .connect(process.env.MONGODB_URI, {
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
app.use("/api/v1/email", emailRoute);

//static files
const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "./client/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "./client", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
