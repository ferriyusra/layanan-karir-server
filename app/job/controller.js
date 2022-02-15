const Job = require('./model');
const Company = require('../company/model');
const JobSkills = require('../jobskill/model');

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

        let count = await Job.find(criteria).countDocuments();

        let jobs = await Job.find(criteria)
            .limit(parseInt(limit))
            .skip(parseInt(skip))
            .populate({
                path: 'company_name',
                populate:{
                    path: 'industry',
                    model: "Industry"
                }
            })
            .populate('job_skills')
            .select('-__v');

        return res.status(200).json({
            code: 200,
            status: "OK",
            message: 'Success get all jobs',
            data: jobs,
            count_data: count
        });

    } catch (err) {
        next(err)
    }

}

async function show(req, res, next) {

    try {

        let {job_id} = req.params;

        let job = await Job.findOne({ _id: job_id })
            .populate({
                path: 'company_name',
                populate:{
                    path: 'industry',
                    model: "Industry"
                }
            })
            .populate('job_skills')
            .select('-__v');

        if (job) {
            return res.status(200).json({
                code: 200,
                status: "OK",
                message: 'Success get detail job',
                data: job,
            });
        } else {
            return res.status(404).json({
                code: 404,
                status: "NOT FOUND",
                message: 'Id job not found',
            });
        }

    } catch (err) {

        next(err)

    }

}
async function showByCompany(req, res, next) {

    try {

        let {company_id} = req.params;

        let job = await Job.findOne({ 'company_name.Company' : company_id })
            .populate({
                path: 'company_name',
                populate:{
                    path: 'industry',
                    model: "Industry"
                }
            })
            .populate('job_skills')
            .select('-__v');

        if (job) {
            return res.status(200).json({
                code: 200,
                status: "OK",
                message: 'Success get detail job by company',
                data: job,
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

        if (payload.company_name) {

            let company_name = await Company.findOne(
                {
                    company_name: { $regex: payload.company_name, $options: 'i' }
                }
            )

            if (company_name) {
                payload = { ...payload, company_name: company_name._id };
            } else {
                delete payload.company_name;
            }
        }

        if (payload.job_skills && payload.job_skills.length) {

            let job_skills = await JobSkills.find({ name: { $in: payload.job_skills } });

            if (job_skills.length) {

                payload = { ...payload, job_skills: job_skills.map(job_skill => job_skill._id) }

            }

        }

        let job = new Job(payload);

        await job.save();

        return res.status(201).json({
            code: 200,
            status: "OK",
            message: 'Success create job',
            data: job
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

        if (payload.company_name) {

            let company_name = await Company.findOne(
                {
                    company_name: { $regex: payload.company_name, $options: 'i' }
                }
            )

            if (company_name) {
                payload = { ...payload, company_name: company_name._id };
            } else {
                delete payload.company_name;
            }
        }

        if (payload.job_skills && payload.job_skills.length) {

            let job_skills = await JobSkills.find({ name: { $in: payload.job_skills } });

            if (job_skills.length) {

                payload = { ...payload, job_skills: job_skills.map(job_skill => job_skill._id) }

            }

        }


        let job = await Job.findOneAndUpdate(
            { _id: req.params.id },
            payload,
            { new: true, runValidators: true }
        );

        return res.status(201).json({
            code: 200,
            status: "OK",
            message: 'Success update job',
            data: job
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

async function destroy(req, res, next) {

    try {

        let jobId = req.params.id;

        let job = await Job.findOneAndDelete(
            {
                _id: jobId
            },
        )

        if (job) {
            return res.status(200).json({
                code: 200,
                status: "OK",
                message: 'Success delete job',
                data: job
            });

        } else {
            return res.status(404).json({
                code: 404,
                status: "NOT FOUND",
                message: 'Id job not found',
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
    showByCompany
}