const mongoose = require('../services/mongoConnection');

const ecovianSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, required: false, default: Date.now() },
    updatedAt: { type: Date, required: false, default: Date.now() },
});

const ecovianModel = new mongoose.model('Ecovian', ecovianSchema);

module.exports = ecovianModel;
