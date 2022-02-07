const Category = require("./model");


async function index(req, res, next) {
    try {

        let categories = await Category.find().select('-__v');
        return res.status(200).json({
            code: 200,
            status: "OK",
            message: 'Success get all category',
            data: categories
        });
    } catch (err) {
        next(err)
    }
}

async function store(req, res, next) {

    try {

        let payload = req.body;

        let category = new Category(payload);

        await category.save();

        return res.status(201).json({
            code: 200,
            status: "OK",
            message: 'Success create category',
            data: category
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

        let categoryId = req.params.id;


        let category = await Category.findOneAndUpdate(
            {
                _id: categoryId
            },
            payload,
            {
                new: true,
                runValidators: true
            }
        )

        if (category) {
            return res.status(201).json({
                code: 200,
                status: "OK",
                message: 'Success update category',
                data: category
            });

        } else {
            return res.status(404).json({
                code: 404,
                status: "NOT FOUND",
                message: 'Id category not found',
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

        let categoryId = req.params.id;

        let category = await Category.findOneAndDelete(
            {
                _id: categoryId
            },
        )

        if (category) {
            return res.status(200).json({
                code: 200,
                status: "OK",
                message: 'Success delete category',
                data: category
            });

        } else {
            return res.status(404).json({
                code: 404,
                status: "NOT FOUND",
                message: 'Id category not found',
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