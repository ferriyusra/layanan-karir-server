const mongoose = require('mongoose');

const { model, Schema } = mongoose;

const announcementSchema = Schema({

    title: {
        type: String,
        minlength: [3, 'Panjang judul berita minimal 3 karakter'],
        maxlength: [255, 'Panjang judul berita maksimal 255 karakter'],
        required: [true, 'Judul berita harus diisi']
    },
    description: {
        type: String,
        minlength: [3, 'Panjang isi berita  minimal 3 karakter'],
        required: [true, 'Isi berita harus diisi']
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    image_url: String,
}, { timestamps: true });


module.exports = model('Announcement', announcementSchema);