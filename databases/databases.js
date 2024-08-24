const mongoose = require('mongoose')

mongoose.connect('mongodb://160.19.166.181:27017/autodex')

const db = mongoose.connection

db.on('error', console.log.bind(console, 'databases connection error'))
db.on('open', () => console.log('databases connection success'))