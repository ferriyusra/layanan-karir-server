const mongoose = require('mongoose');

const { model, Schema } = mongoose;

const jobSkillSchema = Schema({
    name: {
        type: String,
        minlength: [3, 'Panjang Kemampuan kerja minimal 3 karakter'],
        maxlength: [255, 'Panjang Kemampuan kerja maksimal 255 karakter'],
        required: [true, 'Kemampuan kerja harus diisi']
    },

}, { timestamp: true });


module.exports = model('JobSkill', jobSkillSchema);