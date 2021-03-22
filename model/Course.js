const mongoose = require('mongoose')


const CourseSchema= new mongoose.Schema({
    title:{
        type:String,
        trim:true,
        required:[true,'Plsease add a course title']
    },
    description:{
        type:String,
        required:[true,'Plsease add a description']
    },
    weeks:{
        type:String,
        required:[true,'Please add number of weeks']
    },
    tuition:{
        type:Number,
        required:[true,'Plsease add tuition cost']
    },
    minimumSkill:{
        type:String,
        required:[true,'Plsease add a minimum skill'],
        enum:['beginner','intermediate','advanced']
    },
    scholarShipAvailable:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    bootcamp:{
        type:mongoose.Schema.ObjectId,
        ref:'Bootcamp',
        required:true
    }
})


module.exports=mongoose.model('Course',CourseSchema)