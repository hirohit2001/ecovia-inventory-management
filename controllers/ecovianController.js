const ecovianModel = require('../models/ecovianModel');
const auth = require('../util/authentication');
const bcrypt = require('bcryptjs');

// verify the token
const isAuthenticated = (req, res, next) => {
    let responseData = {
        success: false,
        msg: 'Invalid params',
    };
    let token = req.headers.token;
    if (!token) {
        return res.status(400).send(responseData);
    }
    try {
        let ecovian = auth.verifyToken(token);
        req.ecovian = ecovian;
        next();
    } catch (err) {
        console.log(err);
        responseData.msg = 'Invalid token';
        return res.status(400).send(responseData);
    }
};

// create a new ecovian account
const signup = async (req, res) => {
    let responseData = {
        success: false,
        msg: 'Invalid params',
    };
    let data = req.body,
        username = data.username,
        password = data.password;
    if (!username || !password) {
        return res.status(400).send(responseData);
    }
    try {
        let result = await ecovianModel.find({ username });
        if (result.length > 0) {
            responseData.msg = 'Username already exists';
            return res.status(400).send(responseData);
        }
        let salt = bcrypt.genSaltSync(10);
        password = bcrypt.hashSync(password, salt);
        let ecovian = new ecovianModel({ username, password });
        result = await ecovian.save();
        responseData.success = true;
        responseData.msg = 'Successfully created ecovian account';
        responseData.result = result;
        return res.status(200).send(responseData);
    } catch (err) {
        console.log(err);
        responseData.msg = 'Error in signup';
        return res.status(500).send(responseData);
    }
};

// login user
const sigin = async (req, res) => {
    let responseData = {
        success: false,
        msg: 'Invalid params',
    };
    let data = req.body,
        username = data.username,
        password = data.password;
    if (!username || !password) {
        return res.status(400).send(responseData);
    }
    try {
        let result = await ecovianModel.find({ username });
        if (result.length === 0) {
            responseData.msg = 'Wrong username';
            return res.status(400).send(responseData);
        }
        let ecovian = result[0];
        if (!bcrypt.compareSync(password, ecovian.password)) {
            responseData.msg = 'Wrong password';
            return res.status(400).send(responseData);
        }
        let token = auth.newToken(ecovian);
        responseData.msg = 'Successfully signed in';
        responseData.success = true;
        responseData.result = { ecovian, token };
        return res.status(200).send(responseData);
    } catch (err) {
        responseData.msg = 'Error in signin';
        return res.status(500).send(responseData);
    }
};

module.exports = { signup, sigin, isAuthenticated };
