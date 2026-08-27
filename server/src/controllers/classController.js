const Class = require("../models/Class");
const Booking = require("../models/Booking");

// POST /api/classes  (Admin only)
// US5 acceptance criteria: missing field or capacity <= 0 -> rejected, no class created.
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
// US5 acceptance criteria: schedule list refreshes and reflects newly created classes immediately.
async function getClasses(req, res) {
  try {
    const classes = await Class.find().sort({ classDateTime: 1 });

    const withAvailability = await Promise.all(
      classes.map(async (c) => {
        const bookedCount = await Booking.countDocuments({ class: c._id });
        return {
          ...c.toObject(),
          availableSpots: c.capacity - bookedCount,
        };
      })
    );

    return res.json(withAvailability);
  } catch (err) {
    return res.status(500).json({ error: "Could not load classes." });
  }
}

module.exports = { createClass, getClasses };