import express from "express";
import fs from 'fs';
import path from 'path';
import cors from "cors";
import { fileURLToPath } from 'url'; 

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());


const filename = fileURLToPath(import.meta.url);  
const dirname = path.dirname(filename);  
const dataFilePath = path.join(dirname, 'data', 'data.json'); 


const readDataFromFile = () => {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(data); 
  } catch (err) {
    console.error("Error reading data file:", err);
    return {}; 
  }
};

app.get("/data/bajajcard", (req, res) => {
  const data = readDataFromFile();
  res.json(data); 
});

app.get("/data/earningcard", (req, res) => {
  const data = readDataFromFile();
  res.json(data); 
});

app.get("/data/popularcard", (req, res) => {
  const data = readDataFromFile();
  res.json(data); 
});

app.get("/data/totalgrothbar", (req, res) => {
  const data = readDataFromFile();
  res.json(data); 
});

app.get("/data/totalincomedark", (req, res) => {
  const data = readDataFromFile();
  res.json(data); 
});

app.get("/data/totalincomelight", (req, res) => {
  const data = readDataFromFile();
  res.json(data); 
});

app.get("/data/totalorderline", (req, res) => {
  const data = readDataFromFile();
  res.json(data); 
});



app.get("/", (req, res) => {
  res.send("Server is ready");
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
