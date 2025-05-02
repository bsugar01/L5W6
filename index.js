const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const app = express();

mongoose
  .connect("mongodb://20.0.153.128:10999/sagar01DB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.set("view engine", "ejs");

const patientSchema = new mongoose.Schema({ name: String,
  age: Number,
  illness: String,
  roomNumber: String,});
const patient = mongoose.model("patient", patientSchema);

app.get("/", (req, res) => {
  res.redirect("/patients");
});

app.get("/patients", async (req, res) => {
  try {
    const patients = await patient.find();
    res.render("patients", { patients });
  } catch (error) {
    res.status(500).send("Error fetching patients");
  }
});

app.get("/patient/new", (req, res) => {
  res.render("new_patient");
});

app.post("/patient", async (req, res) => {
  try {
    const newpatient = new patient({ name: req.body.name, age: req.body.age, illness: req.body.illness, roomNumber: req.body.roomNumber });
    await newpatient.save();
    res.redirect("/patients");
  } catch (error) {
    res.status(500).send("Error adding patient");
  }
});

app.get("/patient/:id", async (req, res) => {
  try {
    const patient = await patient.findById(req.params.id);
    if (!patient) return res.status(404).send("patient Not Found");
    res.render("patient", { patient });
  } catch (error) {
    res.status(500).send("Error fetching patient");
  }
});

app.get("/patient/:id/edit", async (req, res) => {
  try {
    const patient = await patient.findById(req.params.id);
    if (!patient) return res.status(404).send("patient Not Found");
    res.render("edit_patient", { patient });
  } catch (error) {
    res.status(500).send("Error fetching patient");
  }
});

app.put("/patient/:id", async (req, res) => {
  try {
    const patient = await patient.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name, age: req.body.age, illness: req.body.illness, roomNumber: req.body.roomNumber },
      { new: true }
    );
    if (!patient) return res.status(404).send("patient Not Found");
    res.redirect("/patients");
  } catch (error) {
    res.status(500).send("Error updating patient");
  }
});

app.delete("/patient/:id", async (req, res) => {
  try {
    const patient = await patient.findByIdAndDelete(req.params.id);
    if (!patient) return res.status(404).send("patient Not Found");
    res.redirect("/patients");
  } catch (error) {
    res.status(500).send("Error deleting patient");
  }
});

app.listen(10020, () => console.log("Server is running on port 3000"));
