const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const multer = require("multer");
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3003
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL,{
  });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB!')
});

// Define a schema and model for your data
const commentSchema = new mongoose.Schema({
  mobileNumber: { type: String, required: true},
  email: { type: String, required: true },
  name: { type: String, required: true },
  comment: { type: String },
});

const Comment = mongoose.model('Comment', commentSchema);



app.use('/static', express.static('public', { maxAge: '10y' }));
// Create a POST route to handle incoming data
app.use(cors());
app.post('/api/comments', async (req, res) => {
  try {
    const { mobileNumber, email, name, comment } = req.body;

    // Save the data to MongoDB
    const newComment = new Comment({ mobileNumber, email, name, comment });
    await newComment.save();

    res.status(201).json({ message: 'Comment saved successfully!' });
  } catch (err) {
    console.error('Error saving comment:', err);
    res.status(500).json({ error: 'Something went wrong!'});
  }

});
//mullter using
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });


const submissionSchema = new mongoose.Schema({
  name: { type: String,   },
  email: { type: String,  },
  phoneNumber: { type: Number, },
  class10th: { type: Number,  },
  class12th: { type: Number, },
  graduation: { type: String, },
  graguationMarks:{type:Number, },
  experience: { type: String, },
  skills: { type: String,},
  resumePath: { type: String },
});

const Submission = mongoose.model('Submission', submissionSchema);
// Middleware setup
app.use(express.json());
app.use(cors());

// POST route to handle form submission
app.post('/api/submit', upload.single('resume'), async (req, res) => {
  const {
    name,
    email,
    phoneNumber,
    class10th,
    class12th,
    graduation,
    degreemarks,
    experience,
    skills,
  } = req.body;
  const resumePath = req.file ? req.file.path : null;

  // Save the data to MongoDB in the new collection
  try {
    const newSubmission = new Submission({
      name,
      email,
      phoneNumber,
      class10th,
      class12th,
      graduation,
      degreemarks,
      experience,
      skills,
      resumePath,
    });
    await newSubmission.save();
    res.json({ message: 'Submission saved successfully!' });
  } catch (err) {
    console.error('Error saving submission:', err);
    res.status(500).json({ error: 'Something went wrong!' });
  }
});
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
