const mongoose = require('../services/mongoConnection');
const ObjectId = mongoose.Schema.Types.ObjectId;

const inventorySchema = new mongoose.Schema({
    ecovianId: { type: ObjectId, required: true, ref:'Ecovian' },
    damage: { type: Number, required: false, default: 0 },
    repair: { type: Number, required: false, default: 0 },
    ready: { type: Number, required: false, default: 0 },
    name: { type: String, required: true },
    address: { type: String, required: true },
});

const inventoryModel = new mongoose.model('Inventory', inventorySchema);

module.exports = inventoryModel;
