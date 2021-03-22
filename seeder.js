const fs= require('fs')
const mongoose= require('mongoose')
const dotenv= require('dotenv')


dotenv.config({path:'./config/config.env'})

const Bootcamp =require('./model/Bootcamp')
const Course =require('./model/Course')

mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology:true
})


const bootcamps=JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`,'utf-8'))
const courses=JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`,'utf-8'))


const importData=async()=>{
    try{
        await Bootcamp.create(bootcamps)
        await Course.create(courses)

        console.log('Data created');

        process.exit()
    }catch(err){
    console.log(err);
    }
}


const deleteData=async()=>{
    try{
        
        await Bootcamp.deleteMany()
        await Course.deleteMany()
        console.log('delted');
        process.exit()
    }catch(err){
        console.log(err);
    }
}
if(process.argv[2]==='-i'){

    importData()

}else if(process.argv[2]==='-d'){
    deleteData()
}