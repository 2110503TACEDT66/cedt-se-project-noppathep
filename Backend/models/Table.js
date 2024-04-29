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
    },
    alreadyReserve:[{
        type:Date
    }]
});

TableSchema.methods.addReserveDate = function(date) {
    this.alreadyReserve.push(date);
    return this.save();
};

TableSchema.methods.removeReserveDate = function(date) {
    const index = this.alreadyReserve.indexOf(date);
    if (index !== -1) {
        this.alreadyReserve.splice(index, 1);
    }
    return this.save();
};

module.exports=mongoose.model('Table',TableSchema);