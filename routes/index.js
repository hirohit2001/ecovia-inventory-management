const express = require('express');
const ecovianController = require('../controllers/ecovianController');
const inventoryController = require('../controllers/inventoryController');
const bagsController = require('../controllers/bagsController');
let router = express.Router();

// before authentication
router.post('/signup', ecovianController.signup);
router.post('/signin', ecovianController.sigin);

// authenticate the user
router.use(ecovianController.isAuthenticated);

// after authentication
router.post('/createinventory', inventoryController.createInventory);
router.get('/getinventories', inventoryController.getInventories);
router.post('/inventorydetails', inventoryController.inventoryDetails);
router.post('/addbags', bagsController.addBags);
router.post('/movebags', bagsController.moveBags);
router.post('/deletebags', bagsController.deleteBags);
router.post('/passinventory', inventoryController.passInventory);

module.exports = router;
