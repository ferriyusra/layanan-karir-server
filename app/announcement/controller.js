const fs = require('fs');
const path = require('path');

const Announcement = require('./model');
const Category = require('../category/model');
const config = require('../config');

async function index(req, res, next) {

    try {

        let { limit = 10, skip = 0, query = '', category = '' } = req.query;
        let criteria = {};

        if (category.length) {
            category = await Category.findOne(
                {
                    name: { $regex: `${category}`, $options: 'i' },

                }
            );

            if (category) {
                criteria = {
                    ...criteria,
                    category: category._id
                }
            }
        }

        if (query.length) {
            criteria = {
                ...criteria,
                title: { $regex: `${query}`, $options: 'i' }
            }
        }


        let announcements = await Announcement.find(criteria).limit(parseInt(limit)).skip(parseInt(skip)).populate('category').select('-__v');

        return res.status(200).json({
            code: 200,
            status: "OK",
            message: 'Success get all announcements',
            data: announcements
        });

    } catch (err) {
        next(err)
    }

}

async function show(req, res, next) {

    try {

        let {announcement_id} = req.params;

        let announcement = await Announcement.findOne({ _id: announcement_id }).populate('category').select('-__v');

        if (announcement) {
            return res.status(200).json({
                code: 200,
                status: "OK",
                message: 'Success get detail announcement',
                data: announcement
            })
        } else {
            return res.status(404).json({
                code: 404,
                status: 'NOT FOUND',
                message: "Id announcement not found",
            })
        }

    } catch (err) {
        next(err);
    }

}

async function store(req, res, next) {


    try {

        let payload = req.body;

        if (payload.category) {

            let category = await Category.findOne(
                {
                    name: { $regex: payload.category, $options: 'i' }
                }
            )

            if (category) {
                payload = { ...payload, category: category._id };
            } else {
                delete payload.category;
            }
        }

        if (req.file) {

            let tmp_path = req.file.path;
            let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
            let filename = req.file.filename + '.' + originalExt;
            let target_path = path.resolve(config.rootPath, `public/upload/announcement/${filename}`);

            const src = fs.createReadStream(tmp_path);
            const dest = fs.createWriteStream(target_path);
            src.pipe(dest);

            src.on('end', async () => {
                try {

                    let announcement = new Announcement({
                        ...payload,
                        image_url: filename
                    });

                    await announcement.save();

                    return res.status(201).json({
                        code: 200,
                        status: "OK",
                        message: 'Success create announcement',
                        data: announcement
                    });

                } catch (err) {

                    fs.unlinkSync(target_path);

                    if (err && err.name === 'ValidationError') {
                        return res.status(400).json({
                            code: 400,
                            status: "BAD REQUEST",
                            message: err.message,
                            fields: err.errors
                        });
                    }
                    next(err)
                }
            });

            src.on('error', async () => {
                next(err)
            })

        } else {

            let announcement = new Announcement(payload);

            await announcement.save();

            return res.status(201).json({
                code: 200,
                status: "OK",
                message: 'Success create announcement',
                data: announcement
            });

        }


    } catch (err) {

        if (err && err.name === 'ValidationError') {
            return res.status(400).json({
                code: 400,
                status: "BAD REQUEST",
                message: err.message,
                fields: err.errors
            });
        }

        next(err)

    }


}

async function update(req, res, next) {

    try {

        let payload = req.body;

        if (payload.category) {

            let category = await Category.findOne(
                {
                    name: { $regex: payload.category, $options: 'i' }
                }
            )

            if (category) {
                payload = { ...payload, category: category._id };
            } else {
                delete payload.category;
            }
        }


        if (req.file) {

            let tmp_path = req.file.path;
            let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
            let filename = req.file.filename + '.' + originalExt;
            let target_path = path.resolve(config.rootPath, `public/upload/announcement/${filename}`);

            const src = fs.createReadStream(tmp_path);
            const dest = fs.createWriteStream(target_path);
            src.pipe(dest);

            src.on('end', async () => {
                try {

                    let announcement = await Announcement.findOne({ _id: req.params.id });

                    let currentImage = `${config.rootPath}/public/upload/announcement/${announcement.image_url}`;


                    if (fs.existsSync(currentImage)) {
                        fs.unlinkSync(currentImage)
                    }

                    announcement = await Announcement.findOneAndUpdate(
                        { _id: req.params.id },
                        { ...payload, image_url: filename },
                        { new: true, runValidators: true }
                    )

                    return res.status(201).json({
                        code: 200,
                        status: "OK",
                        message: 'Success update announcement',
                        data: announcement
                    });

                } catch (err) {

                    fs.unlinkSync(target_path);

                    if (err && err.name === 'ValidationError') {
                        return res.status(400).json({
                            code: 400,
                            status: "BAD REQUEST",
                            message: err.message,
                            fields: err.errors
                        });
                    }
                    next(err)
                }
            });

            src.on('error', async () => {
                next(err)
            })

        } else {

            let announcement = await Announcement.findOneAndUpdate(
                { _id: req.params.id },
                payload,
                { new: true, runValidators: true }
            );



            return res.status(201).json({
                code: 200,
                status: "OK",
                message: 'Success update announcement',
                data: announcement
            });

        }


    } catch (err) {

        if (err && err.name === 'ValidationError') {
            return res.status(400).json({
                code: 400,
                status: "BAD REQUEST",
                message: err.message,
                fields: err.errors
            });
        }

        next(err)

    }


}

async function destroy(req, res, next) {

    try {

        let announcementId = req.params.id;

        let announcement = await Announcement.findOneAndDelete(
            {
                _id: announcementId
            },
        )

        let currentImage = `${config.rootPath}/public/upload/announcement/${announcement.image_url}`;

        if (fs.existsSync(currentImage)) {
            fs.unlinkSync(currentImage)
        }

        if (announcement) {
            return res.status(200).json({
                code: 200,
                status: "OK",
                message: 'Success delete announcement',
                data: announcement
            });

        } else {
            return res.status(404).json({
                code: 404,
                status: "NOT FOUND",
                message: 'Id announcement not found',
            });
        }

    } catch (err) {

        next(err)
    }

}

module.exports = {
    index,
    show,
    store,
    update,
    destroy,
}