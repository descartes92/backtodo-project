const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let taskSchema = new mongoose.Schema({

    
    idUser: {type: Schema.Types.ObjectId, ref: 'user'},
    
    description: {
    type: 'string',
    required: "tu dois remplir ce champ"
    },

    etat :{
        type:'boolean',
        default :false 
        
    },

    idList:{ type: Schema.Types.ObjectId, ref: 'list' }


})

module.exports = mongoose.model('task', taskSchema);
