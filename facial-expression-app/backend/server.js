const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { spawn } = require("child_process");
const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));

app.post("/detect_emotion", (req, res) => {
  const { image } = req.body;
  const pythonProcess = spawn("python3", ["model.py", image]);
  
  pythonProcess.stdout.on("data", (data) => {
    const emotion = data.toString().trim();
    res.json({ emotion });
  });
  
  pythonProcess.stderr.on("data", (data) => {
    console.error(`Error: ${data}`);
    res.status(500).json({ error: "Failed to process image" });
  });
});

app.listen(5000, () => console.log("Server running on port 5000"));
