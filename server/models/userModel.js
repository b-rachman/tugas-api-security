const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    nama_belakang: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    jabatan: {
        type: String,
        default: 'kasir',
        enum: ['kasir', 'manager', 'bos']
    },
    accessToken: {
        type: String
    }
})

const User = mongoose.model('user', UserSchema)

module.exports = User;