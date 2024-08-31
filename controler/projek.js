const FileProjek = require('../model/model-file')
const FolderProjek = require('../model/model-folder')
const { deleteObject } = require('./viewer')

module.exports = {
    getFolderList: async (req, res, next) => {
        try {
            const datas = await FolderProjek.find({ user_id: req.user.id })

            const total_projek = datas.length

            res.status(200).json({
                message: "get data folder success",
                total_projek,
                datas
            })
        } catch (error) {
            console.log(error)
            next(error)
        }
    },

    createFolder: async (req, res, next) => {
        try {
            const data = await FolderProjek.create({ nama_folder: req.body.nama_folder, user_id: req.user.id })

            res.status(201).json({
                message: 'create data success',
                data
            })
        } catch (error) {
            console.log(error)
            next(error)
        }
    },

    deleteProjek: async (req, res, next) => {
        try {
            const data = await FolderProjek.findById(req.params.id)
            if (!data) return res.status(404).json({ message: 'data Not Found' })

            const dataFileProjek = await FileProjek.find({ folder_id: data._id })

            for (let item of dataFileProjek) {
                await deleteObject(item.nama)
            }

            await FileProjek.deleteMany({ folder_id: data._id })

            await FolderProjek.deleteOne({ _id: data._id })

            res.status(200).json({
                message: 'delete data success'
            })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}