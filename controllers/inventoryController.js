const bagModel = require('../models/bagsModel');
const ecovianModel = require('../models/ecovianModel');
const inventoryModel = require('../models/inventoryModel');

// create a new inventory
const createInventory = async (req, res) => {
    let responseData = {
        success: false,
        msg: 'Invalid params',
    };
    let data = req.body,
        ecovianId = req.ecovian._id,
        name = data.name,
        address = data.address;
    if (!ecovianId || !address) {
        return res.status(400).send(responseData);
    }
    try {
        let result = await inventoryModel.find({ name, address });
        if (result.length > 0) {
            responseData.msg = 'Inventory exists with the same name & address';
            return res.status(400).send(responseData);
        }
        let inventory = new inventoryModel({ ecovianId, name, address });
        result = await inventory.save();
        responseData.success = true;
        responseData.msg = 'Successfully created inventory';
        responseData.result = result;
        return res.status(200).send(responseData);
    } catch (err) {
        console.log(err);
        responseData.msg = 'Error in creating the inventory';
        return res.status(500).send(responseData);
    }
};

// pass the inventory to some other ecovian
const passInventory = async (req, res) => {
    let responseData = {
        success: false,
        msg: 'Invalid parameters',
    };
    let data = req.body,
        inventoryId = data.inventoryId,
        toEcovianId = data.toEcovianId,
        ecovianId = req.ecovian._id;
    if (!inventoryId || !toEcovianId) {
        return res.status(400).send(responseData);
    }
    try {
        let result = await ecovianModel.find({ _id: toEcovianId });
        if (result.length === 0) {
            responseData.msg = 'The other ecovian does not exist';
            return res.status(400).send(responseData);
        }
        result = await inventoryModel.find({ _id: inventoryId });
        if (result.length === 0) {
            responseData.msg = 'Inventory does not exist';
            return res.status(400).send(responseData);
        }
        let inventory = result[0];
        if (ecovianId !== inventory.ecovianId.toString()) {
            responseData.msg = 'You are not allowed to pass the inventory';
            return res.status(400).send(responseData);
        }
        inventory.ecovianId = toEcovianId;
        result = await inventory.save();
        responseData.success = true;
        responseData.msg = 'Inventory was passed successfully';
        responseData.result = result;
        return res.status(200).send(responseData);
    } catch (err) {
        console.log(err);
        responseData.msg = 'Error in transfering the inventory';
        return res.status(500).send(responseData);
    }
};

// get the list of all the inventories under a given ecovian
const getInventories = async (req, res) => {
    let ecovianId = req.ecovian._id;
    try {
        let result = await inventoryModel.find({ ecovianId });
        let responseData = { success: true, result };
        res.status(200).send(responseData);
    } catch (err) {
        console.log(err);
        responseData.msg = 'Error in getting all inventories';
        return res.status(500).send(responseData);
    }
};

// get all the details of the inventory based on the given ecovian id
const inventoryDetails = async (req, res) => {
    let responseData = {
        success: false,
        msg: 'Invalid params',
    };
    console.log('req.body', req.body);
    let data = req.body,
        ecovianId = req.ecovian._id,
        inventoryId = data.inventoryId;
    console.log('inventoryId', inventoryId);
    if (!inventoryId) {
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
        let damageBags = await bagModel.find({
                inventoryId: inventory._id,
                area: 3,
            }),
            repairBags = await bagModel.find({
                inventoryId: inventory._id,
                area: 2,
            }),
            readyBags = await bagModel.find({
                inventoryId: inventory._id,
                area: 1,
            });
        responseData.success = true;
        responseData.msg = 'Successfully fetched inventory details';
        responseData.inventory = {
            inventoryId: inventory.inventoryId,
            name: inventory.name,
            address: inventory.address,
            damageBagsCount: inventory.damage,
            repairBagsCount: inventory.repair,
            readyBagsCount: inventory.ready,
            damageBags,
            repairBags,
            readyBags,
        };
        return res.status(200).send(responseData);
    } catch (err) {
        console.log(err);
        responseData.msg = 'Error in getting inventory details';
        return res.status(500).send(responseData);
    }
};

module.exports = {
    createInventory,
    passInventory,
    getInventories,
    inventoryDetails,
};
