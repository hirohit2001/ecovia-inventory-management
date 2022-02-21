const { v4: uuidv4 } = require('uuid');
const bagModel = require('../models/bagsModel');
const inventoryModel = require('../models/inventoryModel');

// add multiple bags to the db
const addBags = async (req, res) => {
    let responseData = {
        success: false,
        msg: 'Invalid params',
    };
    let data = req.body,
        bags = data.bags,
        inventoryId = data.inventoryId,
        area = data.area,
        ecovianId = req.ecovian._id;
    if (!bags || !inventoryId || !area) {
        return res.status(400).send(responseData);
    }
    for (let i = 0; i < bags.length; i++) {
        let bag = bags[i],
            size = bag.size,
            weight = bag.weight,
            flapColour = bag.flapColour;
        if (!size || !weight || !flapColour) {
            responseData.msg += ' for bag ' + (i + 1);
            return res.status(400).send(responseData);
        }
        bags[i].inventoryId = inventoryId;
        bags[i].area = area;
        bags[i].uuid = uuidv4();
    }
    try {
        let result = await inventoryModel.find({ _id: inventoryId });
        if (result.length === 0) {
            responseData.msg = 'Inventory does not exist';
            return res.status(400).send(responseData);
        }
        let inventory = result[0];
        if (ecovianId !== inventory.ecovianId.toString()) {
            responseData.msg = 'You are not allowed in this inventory';
            return res.status(400).send(responseData);
        }
        result = await bagModel.insertMany(bags);
        let areas = ['', 'ready', 'repair', 'damage'];
        inventory[areas[area]] = inventory[areas[area]] + bags.length;
        result = await inventory.save();
        responseData.msg = 'Successfully added bags';
        responseData.success = true;
        responseData.result = result;
        return res.status(200).send(responseData);
    } catch (err) {
        console.log(err);
        responseData.msg = 'Error in adding bags';
        return res.status(500).send(responseData);
    }
};

// move multiple bags from one area to another
const moveBags = async (req, res) => {
    let responseData = {
        success: false,
        msg: 'Invalid params',
    };
    let data = req.body,
        ecovianId = req.ecovian._id,
        area = data.area,
        inventoryId = data.inventoryId,
        bagIds = data.bagIds;
    if (!bagIds || !area || !inventoryId) {
        return res.status(400).send(responseData);
    }
    try {
        let result = await inventoryModel.find({ _id: inventoryId });
        if (result.length === 0) {
            responseData.msg = 'Inventory does not exist';
            return res.status(400).send(responseData);
        }
        let inventory = result[0];
        if (ecovianId !== inventory.ecovianId.toString()) {
            responseData.msg = 'You are not allowed in this inventory';
            return res.status(400).send(responseData);
        }
        let bags = [],
            curArea = null; // the area in which they are present now
        for (let i = 0; i < bagIds.length; i++) {
            result = await bagModel.find({ uuid: bagIds[i], inventoryId });
            if (result.length === 0) {
                responseData.msg = i + 1 + ' bag does not exist in inventory';
                return res.status(400).send(responseData);
            }
            let bag = result[0];
            if (i > 0 && bag.area !== curArea) {
                responseData.msg = 'Some bags do not belong to the same area';
                return res.status(400).send(responseData);
            }
            bags.push(bag);
            curArea = bag.area;
        }
        for (let i = 0; i < bags.length; i++) {
            bags[i].area = area;
            result = await bags[i].save();
        }
        let areas = ['', 'ready', 'repair', 'damage'];
        inventory[areas[curArea]] = inventory[areas[curArea]] - bags.length;
        inventory[areas[area]] = inventory[areas[area]] + bags.length;
        result = await inventory.save();
        responseData.success = true;
        responseData.msg = 'Successfully moved the bags';
        responseData.result = result;
        return res.status(200).send(responseData);
    } catch (err) {
        console.log(err);
        responseData.msg = 'Error in moving bags';
        return res.status(500).send(responseData);
    }
};

// delete all those bags which have been shipped
const deleteBags = async (req, res) => {
    let responseData = {
        success: false,
        msg: 'Invalid params',
    };
    let data = req.body,
        ecovianId = req.ecovian._id,
        inventoryId = data.inventoryId,
        bagIds = data.bagIds;
    if (!bagIds || !inventoryId) {
        return res.status(400).send(responseData);
    }
    try {
        let result = await inventoryModel.find({ _id: inventoryId });
        if (result.length === 0) {
            responseData.msg = 'Inventory does not exist';
            return res.status(400).send(responseData);
        }
        let inventory = result[0];
        if (ecovianId !== inventory.ecovianId.toString()) {
            responseData.msg = 'You are not allowed in this inventory';
            return res.status(400).send(responseData);
        }
        for (let i = 0; i < bagIds.length; i++) {
            result = await bagModel.find({ uuid: bagIds[i], inventoryId });
            if (result.length === 0) {
                responseData.msg = i + 1 + 'Some bags dont exist in inventory';
                return res.status(400).send(responseData);
            }
            let bag = result[0];
            if (bag.area !== 1) {
                responseData.msg = 'Some bags are not in the ready area';
                return res.status(400).send(responseData);
            }
        }
        result = await bagModel.deleteMany({ uuid: { $in: bagIds } });
        inventory['ready'] = inventory['ready'] - bagIds.length;
        result = await inventory.save();
        responseData.success = true;
        responseData.msg = 'Successfully deleted the bags';
        responseData.result = result;
        return res.status(200).send(responseData);
    } catch (err) {
        console.log(err);
        responseData.msg = 'Error in deleting bags';
        return res.status(500).send(responseData);
    }
};

module.exports = { addBags, moveBags, deleteBags };
