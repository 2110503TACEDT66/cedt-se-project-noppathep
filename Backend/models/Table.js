const mongoose=require('mongoose');

const TableSchema = new mongoose.Schema({
    size:{
        type : Number,
        required:[true,'Please add size to this table']
    },
    restaurant:{
        type:mongoose.Schema.ObjectId,
        ref:'Restaurant',
        require:true
    }
});
module.exports=mongoose.model('Table',TableSchema);