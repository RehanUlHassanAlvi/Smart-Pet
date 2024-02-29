const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  phone: { type: String, required: true },
  name: { type: String, required: true },
  shippedFrom: { type: String, required: true },
  shippedTo: { type: String, required: true },
  departureDate: { type: Date, required: true },
  pets: [{
    name: { type: String, required: true },
    breed: { type: String },
    ageInYears: { type: Number },
    weight: { type: Number },
    crateSize: { type: String }
  }],
  additionalComments: { type: String },
  approvedKennels: { type: Boolean, default: false },
  hearDetails: { type: String },
  militaryVet: { type: Boolean, default: false },
  petsMicrochipped: { type: Boolean, default: false },
  rabiesVaccine: { type: Boolean, default: false },
  with5DaysTravel: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', userSchema);
