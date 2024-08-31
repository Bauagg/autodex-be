const mongoose = require('mongoose')

const modelFileProjek = new mongoose.Schema({
    folder_id: {
        type: mongoose.Types.ObjectId,
        ref: 'FolderProjek',
        required: [true, 'FolderProjek harus di isi']
    },
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'user_id harus di isi']
    },
    nama: {
        type: String,
        required: [true, 'nama harus di isi']
    },
    urn: {
        type: String,
        required: [true, 'urn harus di isi']
    }
}, { timestamps: true })

const FileProjek = mongoose.model("FileProjek", modelFileProjek)

module.exports = FileProjek