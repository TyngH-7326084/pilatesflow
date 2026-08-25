const Class = require("../models/Class");

// POST /api/classes  (Admin only)
// AC: missing field or capacity <= 0 -> rejected, no class created.
async function createClass(req, res) {
  const { className, instructorName, classDateTime, capacity } = req.body;

  if (!className || !instructorName || !classDateTime || capacity === undefined) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const capacityNum = Number(capacity);
  if (Number.isNaN(capacityNum) || capacityNum <= 0) {
    return res.status(400).json({ error: "Capacity must be greater than zero." });
  }

  const parsedDate = new Date(classDateTime);
  if (Number.isNaN(parsedDate.getTime())) {
    return res.status(400).json({ error: "Enter a valid class date and time." });
  }

  try {
    const newClass = await Class.create({
      className: className.trim(),
      instructorName: instructorName.trim(),
      classDateTime: parsedDate,
      capacity: capacityNum,
      createdBy: req.user.sub,
    });

    return res.status(201).json(newClass);
  } catch (err) {
    return res.status(500).json({ error: "Could not create class." });
  }
}

// GET /api/classes
// AC: schedule list refreshes and reflects newly created classes immediately.
async function getClasses(req, res) {
  try {
    const classes = await Class.find().sort({ classDateTime: 1 });
    return res.json(classes);
  } catch (err) {
    return res.status(500).json({ error: "Could not load classes." });
  }
}

module.exports = { createClass, getClasses };