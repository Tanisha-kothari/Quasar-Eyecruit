const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
require('dotenv').config(); // Load environment variables from .env

const app = express();

app.use(cors());
app.use(express.json());

// Test route to check if the server is running
app.get('/test', (req, res) => {
    res.status(200).json({ message: 'Server is running properly!' });
});

// Generate questions based on skills and difficulty
app.post('/generate-questions', (req, res) => {
    const { skills, difficulty } = req.body;

    if (!skills || !difficulty) {
        return res.status(400).send('Skills and difficulty level are required.');
    }

    const pythonProcess = spawn('python', ['generate_questions.py', JSON.stringify(skills), difficulty]);

    let questions = [];

    pythonProcess.stdout.on('data', (data) => {
        questions = questions.concat(data.toString().trim().split('\n'));
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Python script error: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            return res.status(500).send('Error generating questions.');
        }
        res.json({ questions });
    });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});