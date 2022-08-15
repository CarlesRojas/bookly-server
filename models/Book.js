const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    userId: {
        type: mongoose.ObjectId,
        required: true,
        min: 3,
        max: 12
    },
    bookId: {
        type: String,
        required: true,
        min: 6,
        max: 256
    },
    status: {
        type: String,
        required: true,
        enum: ['finished', 'wantToRead', 'reading']
    },
    score: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
    monthFinished: {
        type: Number,
        min: 0,
        max: 11,
        default: null
    },
    yearFinished: {
        type: Number,
        min: 1900,
        default: null
    },
    rereads: [
        {
            month: {
                type: Number,
                min: 0,
                max: 11,
                default: null
            },
            year: {
                type: Number,
                min: 1900,
                default: null
            }
        }
    ]
});

module.exports = mongoose.model('Book', bookSchema);
