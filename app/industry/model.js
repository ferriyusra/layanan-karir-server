const mongoose = require('mongoose');

const { model, Schema } = mongoose;

const industrySchema = Schema({
    name: {
        type: String,
        minlength: [3, 'Panjang industri perusahaan minimal 3 karakter'],
        maxlength: [255, 'Panjang industri perusahaan maksimal 255 karakter'],
        required: [true, 'industri perusahaan harus diisi']
    },

}, { timestamp: true });


module.exports = model('Industry', industrySchema);