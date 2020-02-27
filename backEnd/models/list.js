const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let listSchema = new mongoose.Schema({

    idUser: { type: Schema.Types.ObjectId, ref: 'user' },

    description: {
        type: 'string',
        required: 'veuillez remplir ce champ'
    },
    date: {
        type: 'date',
        default: Date.now()
    }

})

module.exports = mongoose.model('list', listSchema);
