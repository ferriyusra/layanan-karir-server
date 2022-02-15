const fs = require('fs');
const path = require('path');

const Company = require('./model');
const Industry = require('../industry/model');
const config = require('../config');

async function index(req, res, next) {

    try {

        let { limit = 10, skip = 0, query = '' } = req.query;
        let criteria = {};

        if (query.length) {
            criteria = {
                ...criteria,
                company_name: { $regex: `${query}`, $options: 'i' }
            }
        }


        let companies = await Company.find(criteria)
                .limit(parseInt(limit))
                .skip(parseInt(skip))
                .populate('industry')
                .select('-__v');

        return res.status(200).json({
            code: 200,
            status: "OK",
            message: 'Success get all companies',
            data: companies
        });

    } catch (err) {
        next(err)
    }

}

async function show(req, res, next) {
    try {

        let {company_id} = req.params;
        let company = await Company.findOne({ _id: company_id })
                        .populate('industry')
                        .select('-__v');

        if (company) {
            return res.status(200).json({
                code: 200,
                status: "OK",
                message: 'Success get detail company',
                data: company,
            });
        } else {
            return res.status(404).json({
                code: 404,
                status: "NOT FOUND",
                message: 'Id company not found',
            });
        }

    } catch (err) {
        next(err)
    }
}

async function store(req, res, next) {


    try {

        let payload = req.body;

        if (payload.industry) {

            let industry = await Industry.findOne(
                {
                    name: { $regex: payload.industry, $options: 'i' }
                }
            )

            if (industry) {
                payload = { ...payload, industry: industry._id };
            } else {
                delete payload.industry;
            }
        }

        if (req.file) {

            let tmp_path = req.file.path;
            let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
            let filename = req.file.filename + '.' + originalExt;
            let target_path = path.resolve(config.rootPath, `public/upload/company_profile/${filename}`);

            const src = fs.createReadStream(tmp_path);
            const dest = fs.createWriteStream(target_path);
            src.pipe(dest);

            src.on('end', async () => {
                try {

                    let company = new Company({
                        ...payload,
                        company_image_url: filename
                    });

                    await company.save();

                    return res.status(201).json({
                        code: 200,
                        status: "OK",
                        message: 'Success create company',
                        data: company
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

            let company = new Company(payload);

            await company.save();

            return res.status(201).json({
                code: 200,
                status: "OK",
                message: 'Success create company',
                data: company
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

        if (payload.industry) {

            let industry = await Industry.findOne(
                {
                    name: { $regex: payload.industry, $options: 'i' }
                }
            )

            if (industry) {
                payload = { ...payload, industry: industry._id };
            } else {
                delete payload.industry;
            }
        }

        if (req.file) {

            let tmp_path = req.file.path;
            let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
            let filename = req.file.filename + '.' + originalExt;
            let target_path = path.resolve(config.rootPath, `public/upload/company_profile/${filename}`);

            const src = fs.createReadStream(tmp_path);
            const dest = fs.createWriteStream(target_path);
            src.pipe(dest);

            src.on('end', async () => {
                try {

                    let company = await Company.findOne({ _id: req.params.id });

                    let currentImage = `${config.rootPath}/public/upload/company_profile/${company.image_url}`;


                    if (fs.existsSync(currentImage)) {
                        fs.unlinkSync(currentImage)
                    }

                    company = await Company.findOneAndUpdate(
                        { _id: req.params.id },
                        { ...payload, company_image_url: filename },
                        { new: true, runValidators: true }
                    )

                    return res.status(201).json({
                        code: 200,
                        status: "OK",
                        message: 'Success update company',
                        data: company
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

            let company = await Company.findOneAndUpdate(
                { _id: req.params.id },
                payload,
                { new: true, runValidators: true }
            );



            return res.status(201).json({
                code: 200,
                status: "OK",
                message: 'Success update company',
                data: company
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

        let companyId = req.params.id;

        let company = await Company.findOneAndDelete(
            {
                _id: companyId
            },
        )

        let currentImage = `${config.rootPath}/public/upload/company_profile/${company.image_url}`;

        if (fs.existsSync(currentImage)) {
            fs.unlinkSync(currentImage)
        }

        if (company) {
            return res.status(200).json({
                code: 200,
                status: "OK",
                message: 'Success delete company',
                data: company
            });

        } else {
            return res.status(404).json({
                code: 404,
                status: "NOT FOUND",
                message: 'Id company not found',
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