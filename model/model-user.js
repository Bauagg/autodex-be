const mongoose = require('mongoose')

const modelUser = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name harus di isi']
    },
    email: {
        type: String,
        required: [true, 'email harus di isi'],
        validate: {
            validator: (value) => {
                const regex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-]+)(\.[a-zA-Z]{2,5}){1,2}$/
                return regex.test(value)
            },
            message: (props) => `${props.value} email tidak valid`
        }
    },
    password: {
        type: String,
        required: [true, 'password harus di isi']
    },
    konfirmasi_password: {
        type: String,
        required: [true, 'password harus di isi']
    }
})

const User = mongoose.model('User', modelUser)

module.exports = User