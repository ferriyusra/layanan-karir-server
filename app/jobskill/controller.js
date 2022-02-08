const JobSkill = require("./model");


async function index(req, res, next) {
    try {

        let jobSkills = await JobSkill.find().select('-__v');
        return res.status(200).json({
            code: 200,
            status: "OK",
            message: 'Success get all job skills',
            data: jobSkills
        });
    } catch (err) {
        next(err)
    }
}

async function store(req, res, next) {

    try {

        let payload = req.body;

        let jobSkill = new JobSkill(payload);

        await jobSkill.save();

        return res.status(201).json({
            code: 200,
            status: "OK",
            message: 'Success create job skill',
            data: jobSkill
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

        let jobSkillId = req.params.id;


        let jobSkill = await JobSkill.findOneAndUpdate(
            {
                _id: jobSkillId
            },
            payload,
            {
                new: true,
                runValidators: true
            }
        )

        if (jobSkill) {
            return res.status(201).json({
                code: 200,
                status: "OK",
                message: 'Success update job skill',
                data: jobSkill
            });

        } else {
            return res.status(404).json({
                code: 404,
                status: "NOT FOUND",
                message: 'Id job skill not found',
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

        let jobSkillId = req.params.id;

        let jobSkill = await JobSkill.findOneAndDelete(
            {
                _id: jobSkillId
            },
        )

        if (jobSkill) {
            return res.status(200).json({
                code: 200,
                status: "OK",
                message: 'Success delete job skill',
                data: jobSkill
            });

        } else {
            return res.status(404).json({
                code: 404,
                status: "NOT FOUND",
                message: 'Id job skill not found',
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