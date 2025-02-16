const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
require('dotenv').config(); // Load environment variables from .env

const app = express();
const uploadDir = path.join(__dirname, 'uploads');

// Ensure the uploads directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Save files to /uploads directory
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Append timestamp to avoid conflicts
    }
});

const upload = multer({ storage });

app.use(cors());
app.use(express.json());

// Test route to check if the server is running
app.get('/test', (req, res) => {
    res.status(200).json({ message: 'Server is running properly!' });
});

// Upload and process resume
app.post('/upload', upload.single('resume'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const difficulty = req.body.difficulty;
    if (!difficulty) {
        return res.status(400).send('No difficulty level specified.');
    }

    const filePath = path.join(uploadDir, req.file.filename); // Full path to saved file

    const pythonProcess = spawn('python', ['resume_analyzer_v2.py', filePath, difficulty]);

    let questions = [];

    pythonProcess.stdout.on('data', (data) => {
        questions = questions.concat(data.toString().trim().split('\n'));
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Python script error: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            return res.status(500).send('Error processing the resume.');
        }
        res.json({ questions });
    });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
