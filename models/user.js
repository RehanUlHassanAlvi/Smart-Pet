const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  email: { type: String, required: true },
  leadId: { type: String, required: false },
  lastMessageTimestamp: { type: Date },
  invoices: [{
    invoiceId: { type: Number, required: true },
    phone: { type: String, required: true },
    name: { type: String, required: true },
    shippedFrom: { type: String, required: false },
    shippedTo: { type: String, required: false },
    departureDate: { type: Date, required: false },
    pets: [{
      name: { type: String, required: true },
      breed: { type: String },
      ageInYears: { type: Number },
      weight: { type: Number },
      height: { type: Number },
      width: { type: Number }
    }],
    additionalComments: { type: String },
    approvedKennels: { type: Boolean, default: false },
    hearDetails: { type: String },
    militaryVet: { type: Boolean, default: false },
    petsMicrochipped: { type: Boolean, default: false },
    rabiesVaccine: { type: Boolean, default: false },
    with5DaysTravel: { type: Boolean, default: false }
  }],
});

module.exports = mongoose.model('User', userSchema);
