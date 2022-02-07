const mongoose = require('mongoose');

const { model, Schema } = mongoose;

const categorySchema = Schema({
    name: {
        type: String,
        minlength: [3, 'Panjang kategori berita minimal 3 karakter'],
        maxlength: [255, 'Panjang kategori berita maksimal 255 karakter'],
        required: [true, 'Kategori berita harus diisi']
    },

}, { timestamp: true });


module.exports = model('Category', categorySchema);