const mongoose = require('../services/mongoConnection');
const ObjectId = mongoose.Schema.Types.ObjectId;

const bagSchema = new mongoose.Schema({
    uuid: { type: String, required: true, unique: true },
    size: { type: Number, required: true },
    weight: { type: Number, required: true },
    flapColour: { type: String, required: true },
    inventoryId: { type: ObjectId, required: true, ref: 'Inventory' },
    area: { type: Number, required: true },
});

const bagModel = new mongoose.model('Bag', bagSchema);

module.exports = bagModel;
