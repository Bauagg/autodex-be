const router = require('express').Router()
const autorization = require('../middleware/autorization')
const { registerUser, loginUser, profileUser } = require('../controler/user')

router.get('/profil', autorization, profileUser)
router.post('/register', registerUser)
router.post('/login', loginUser)

module.exports = router