const mongoose = require('mongoose')

const modeleFolderProjek = new mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'user_id harus di isi']
    },
    nama_folder: {
        type: String,
        required: [true, 'nama_file harus di isi']
    }
}, { timestamps: true })

const FolderProjek = mongoose.model('FolderProjek', modeleFolderProjek)

module.exports = FolderProjek