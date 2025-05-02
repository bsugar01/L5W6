const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const app = express();

// Connect to MongoDB
mongoose
  .connect("mongodb://20.0.153.128:10999/sagar01DB")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.set("view engine", "ejs");

// Patient Schema
const patientSchema = new mongoose.Schema({
  name: String,
  age: Number,
  illness: String,
  roomNumber: String,
});
const Patient = mongoose.model("Patient", patientSchema);

// Routes
app.get("/", (req, res) => {
  res.redirect("/patients");
});

// List all patients
app.get("/patients", async (req, res) => {
  try {
    const patients = await Patient.find();
    res.render("patients", { patients });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching patients");
  }
});

// Form to add a new patient
app.get("/patient/new", (req, res) => {
  res.render("new_patient");
});

// Add new patient
app.post("/patient", async (req, res) => {
  try {
    const newPatient = new Patient({
      name: req.body.name,
      age: req.body.age,
      illness: req.body.illness,
      roomNumber: req.body.roomNumber,
    });
    await newPatient.save();
    res.redirect("/patients");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding patient");
  }
});

// View a single patient
app.get("/patient/:id", async (req, res) => {
  try {
    console.log("Fetching patient with ID:", req.params.id); // 👈 Log ID
    const patient = await Patient.findById(req.params.id);
    console.log("Found patient:", patient); // 👈 Log result
    if (!patient) return res.status(404).send("Patient Not Found");
    res.render("patient", { patient });
  } catch (error) {
    console.error("Error in /patient/:id route:", error); // 👈 Log error details
    res.status(500).send("Error fetching patient");
  }
});


// Edit patient form
app.get("/patient/:id/edit", async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).send("Patient Not Found");
    res.render("edit_patient", { patient });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching patient");
  }
});

// Update patient
app.put("/patient/:id", async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        age: req.body.age,
        illness: req.body.illness,
        roomNumber: req.body.roomNumber,
      },
      { new: true }
    );
    if (!patient) return res.status(404).send("Patient Not Found");
    res.redirect("/patients");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating patient");
  }
});

// Delete patient
app.delete("/patient/:id", async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) return res.status(404).send("Patient Not Found");
    res.redirect("/patients");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting patient");
  }
});

// Start server
app.listen(10020, () => console.log("Server is running on port 10020"));
