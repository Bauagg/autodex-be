const express = require('express');
const formidable = require('express-formidable');
const { getPublicToken, uploadObject, translateObject, getManifest, urnify, deleteObject } = require('../controler/viewer');
const FileProjek = require('../model/model-file');
const autorization = require('../middleware/autorization')


const router = express.Router();

router.get('/auth/token', async function (req, res, next) {
    try {
        res.json(await getPublicToken());
    } catch (err) {
        next(err);
    }
});

router.get('/models/:id', autorization, async function (req, res, next) {
    try {
        const datas = await FileProjek.find({ folder_id: req.params.id, user_id: req.user.id })
            .populate({
                path: "folder_id",
                populate: "user_id"
            })

        const total_file = datas.length
        res.status(200).json({
            message: 'get data success',
            total_file,
            datas
        });
    } catch (err) {
        next(err);
    }
});

router.get('/models/:urn/status', async function (req, res, next) {
    try {
        const manifest = await getManifest(req.params.urn);
        if (manifest) {
            let messages = [];
            if (manifest.derivatives) {
                for (const derivative of manifest.derivatives) {
                    messages = messages.concat(derivative.messages || []);
                    if (derivative.children) {
                        for (const child of derivative.children) {
                            messages.concat(child.messages || []);
                        }
                    }
                }
            }
            res.json({ status: manifest.status, progress: manifest.progress, messages });
        } else {
            res.json({ status: 'n/a' });
        }
    } catch (err) {
        next(err);
    }
});

router.post('/models', formidable({ maxFileSize: Infinity }), async function (req, res, next) {
    try {
        const { folder_id, user_id } = req.fields

        const file = req.files['modelFile'];
        if (!file) {
            res.status(400).send('The required field ("model-file") is missing.');
            return;
        }

        const obj = await uploadObject(file.name, file.path);
        await translateObject(urnify(obj.objectId), req.fields['model-zip-entrypoint']);

        const data = await FileProjek.create({
            folder_id,
            user_id,
            nama: obj.objectKey,
            urn: urnify(obj.objectId)
        })
        res.status(201).json({
            data
        });
    } catch (err) {
        next(err);
    }
});

router.delete('/models/:id', autorization, async function (req, res, next) {
    try {
        const data = await FileProjek.findOne({ _id: req.params.id, user_id: req.user.id })
        if (!data) return res.status(404).json({ message: 'data Not FOund' })

        await deleteObject(data.nama);
        await FileProjek.deleteOne({ _id: data._id, user_id: req.user.id })
        res.status(200).json({ message: 'Model deleted successfully' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
