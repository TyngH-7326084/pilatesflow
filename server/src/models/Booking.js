const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    class: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  },
  { timestamps: true }
);

// US5 acceptance critera: a member cannot book the same class twice
// unique compound index enforces "no duplicate booking" at the database level
bookingSchema.index({ user: 1, class: 1 }, { unique: true });

module.exports = mongoose.model("Booking", bookingSchema);