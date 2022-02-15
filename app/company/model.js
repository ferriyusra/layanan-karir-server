const mongoose = require('mongoose');

const { model, Schema } = mongoose;

const companySchema = Schema({

    company_name: {
        type: String,
        minlength: [3, 'Panjang Nama Perusahaan minimal 3 karakter'],
        maxlength: [255, 'Panjang Nama Perusahaan maksimal 255 karakter'],
        required: [true, 'Nama Perusahaan harus diisi']
    },

    employeeMin: {
        type: String,
        required: [true, 'deskripsi perushaan harus diisi']
    },
    
    employeeMax: {
        type: String,
        required: [true, 'deskripsi perushaan harus diisi']
    },

    description: {
        type: String,
        minlength: [3, 'Panjang deskripsi perushaan minimal 3 karakter'],
        required: [true, 'deskripsi perushaan harus diisi']
    },

    location: {
        type: String,
        minlength: [3, 'Panjang lokasi perusahaan minimal 3 karakter'],
        maxlength: [255, 'Panjang lokasi perusahaan maksimal 255 karakter'],
        required: [true, 'lokasi perusahaan harus diisi']
    },

    website_url: {
        type: String,
        minlength: [3, 'Panjang website perusahaan minimal 3 karakter'],
        maxlength: [255, 'Panjang website perusahaan maksimal 255 karakter'],
    },

    industry: {
        type: Schema.Types.ObjectId,
        ref: 'Industry'
    },

    company_image_url: String,

}, { timestamps: true });


module.exports = model('Company', companySchema);