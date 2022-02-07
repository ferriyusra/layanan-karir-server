const Industry = require("./model");


async function index(req, res, next) {
    try {

        let industries = await Industry.find().select('-__v');
        return res.status(200).json({
            code: 200,
            status: "OK",
            message: 'Success get all industries',
            data: industries
        });
    } catch (err) {
        next(err)
    }
}

async function store(req, res, next) {

    try {

        let payload = req.body;

        let industry = new Industry(payload);

        await industry.save();

        return res.status(201).json({
            code: 200,
            status: "OK",
            message: 'Success create industry',
            data: industry
        });

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

        let industryId = req.params.id;


        let industry = await Industry.findOneAndUpdate(
            {
                _id: industryId
            },
            payload,
            {
                new: true,
                runValidators: true
            }
        )

        if (industry) {
            return res.status(201).json({
                code: 200,
                status: "OK",
                message: 'Success update industry',
                data: industry
            });

        } else {
            return res.status(404).json({
                code: 404,
                status: "NOT FOUND",
                message: 'Id industry not found',
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

        let industryId = req.params.id;

        let industry = await Industry.findOneAndDelete(
            {
                _id: industryId
            },
        )

        if (industry) {
            return res.status(200).json({
                code: 200,
                status: "OK",
                message: 'Success delete industry',
                data: industry
            });

        } else {
            return res.status(404).json({
                code: 404,
                status: "NOT FOUND",
                message: 'Id industry not found',
            });
        }

    } catch (err) {

        next(err)
    }

}


module.exports = {
    index,
    store,
    update,
    destroy
}