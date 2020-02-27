const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let userSchema = new mongoose.Schema({

    name: {
        type: 'string',
        required: 'You need to specifie a name'
    },
    email: {
        type: 'string',
        required: 'You need to specifie a email',
        unique: true
    },
    password: {
        type: 'string',
        required: 'entrer un mot de mot de passe'
    },

    idList: [{ type: Schema.Types.ObjectId, ref: 'list' }]

});



module.exports = mongoose.model('user', userSchema);


/*
pierre@toxicode.fr
toxicode
*/