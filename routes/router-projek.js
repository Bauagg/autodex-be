const router = require('express').Router()
const autorization = require('../middleware/autorization')

const { getFolderList, createFolder, deleteProjek } = require('../controler/projek')

router.get('/projek', autorization, getFolderList)
router.post('/projek', autorization, createFolder)
router.delete('/projek/:id', autorization, deleteProjek)

module.exports = router