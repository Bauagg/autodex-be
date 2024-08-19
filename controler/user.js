const User = require('../model/model-user')
const bcrypt = require('../utils/bcrypt')
const jwt = require('../utils/jwt')

module.exports = {
    registerUser: async (req, res, next) => {
        try {
            const { name, email, password, konfirmasi_password } = req.body

            const validateEmail = await User.exists({ email })
            if (validateEmail) return res.status(401).json({ error: true, message: 'email sudah terdaftar' })

            if (!password || password.length < 6) return res.status(400).json({ error: true, message: 'password kurang kuat' })

            if (password !== konfirmasi_password) return res.status(400).json({ message: 'konfirmasi password salah' })

            const data = await User.create({ name, email, password: await bcrypt.hashPassword(password), konfirmasi_password: await bcrypt.hashPassword(konfirmasi_password) })

            res.status(200).json({
                message: 'create data success',
                data
            })
        } catch (error) {
            console.log(error)
            if (error && error.name === 'ValidationError') {
                return res.status(400).json({
                    error: true,
                    message: error.message,
                    fields: error.fields
                })
            }

            next(error);
        }
    },

    loginUser: async (req, res, next) => {
        try {
            const { email, password } = req.body

            const newUser = await User.findOne({ email })
            if (!newUser) return res.status(401).json({ error: true, message: 'Email dan Password salah' })

            const verifyPassword = await bcrypt.verifyPassword(password, newUser.password)
            if (!verifyPassword) return res.status(401).json({ error: true, message: 'Email dan Password salah' })

            const payloadToken = {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            }

            const token = await jwt.createToken(payloadToken)

            res.status(200).json({
                error: false,
                message: 'login successfully',
                datas: {
                    name: newUser.name,
                    email: newUser.email,
                    token: token
                }
            })
        } catch (error) {
            console.log(error)
            if (error && error.name === 'ValidationError') {
                return res.status(400).json({
                    error: true,
                    message: error.message,
                    fields: error.fields
                })
            }

            next(error);
        }
    },

    profileUser: async (req, res, next) => {
        try {
            const data = await User.findById(req.user.id)
            if (!data) return res.status(404).json({ message: 'data not Found' })

            res.status(200).json({
                message: 'get data success',
                data
            })
        } catch (error) {
            console.log(error)
            if (error && error.name === 'ValidationError') {
                return res.status(400).json({
                    error: true,
                    message: error.message,
                    fields: error.fields
                })
            }

            next(error);
        }
    }
}