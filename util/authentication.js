const jwt = require('jsonwebtoken');
const httpCodes = require('../constants/backendConfig').httpCodes;

function newToken(ecovian) {
    var token = jwt.sign({ ecovian }, 'relevel', { expiresIn: '10d' });
    return token;
}

function verifyToken(token) {
    let response = jwt.verify(token, 'relevel');
    return response.ecovian;
}

module.exports = { newToken, verifyToken };
