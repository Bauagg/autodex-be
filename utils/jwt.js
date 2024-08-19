const jwt = require('jsonwebtoken')
const { SECRETKEY } = require('../config')

module.exports = {
    createToken: (token) => {
        return jwt.sign(token, SECRETKEY)
    },
    verifyToken: (token) => {
        try {
            return jwt.verify(token, SECRETKEY)
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new Error('Token has expired')
            } else {
                throw new Error('Invalid Token')
            }
        }
    }
}