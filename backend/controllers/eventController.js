import Event from "../models/Event.js";

// Create Event
export const createEvent = async (req, res) => {
  try {
    const eventData = { ...req.body };
    if (req.file) {
      eventData.banner = req.file.path; // Agar file upload use ho raha hai
    }

    const event = await Event.create(eventData);
    res.status(201).json({ success: true, message: "Event Created", event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Events
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.status(200).json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Event
export const updateEvent = async (req, res) => {
  try {
    const eventData = { ...req.body };
    if (req.file) {
      eventData.banner = req.file.path;
    }

    const updated = await Event.findByIdAndUpdate(req.params.id, eventData, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, message: "Event Updated", event: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Event
export const deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Event Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};