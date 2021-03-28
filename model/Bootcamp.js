const mongoose = require('mongoose')
const slugify= require('slugify')
const geocoder= require('../utills/geocoder')

const BootcampSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Plsease add a name'],
        unique:true,
        trim:true,
        maxlenght:[50,'Name can not be more than 50 characters']
    },
    slug:String,
    description:{
        type:String,
         required:[true,'Plsease add a description'],
         maxlenght:[500,'Description can not be more than 50 characters']
    },
    website:{
        type:String,
        match:[/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/,
        'Plsease use a valid URL with HTTP or HTTPS']
    },
    phone:{
        type:String,
        maxlenght:[20,'Phone number can not be longer than 20 characters']
    },
    email:{
        type:String,
        match:[/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,'Please add a valid email']
    },
    address:{
        type:String,
        required:[true,'Plsease add an address']
    },
    location:{
        type:{
            type:String,
            enum:['Point']
         },
        coordinates:{
            type:[Number],
            index:'2dsphere'
        },
        formattedAddress:String,
        street:String,
        city:String,
        state:String,
        zipcode:String,
        country:String
    },
    careers:{
        type:[String],
        required:true,
        enum: [
            'Web Development',
            'Mobile Development',
            'UI/UX',
            'Data Science',
            'Business',
            'Other']
    },
    
    averageRating:{
        type:Number,
        min:[1,'Rating must be at least 1'],
        max:[10,'Rating can not be more than 10']
    },
    averageRating:Number,
    averageCost:Number,
    photo:{
        type:String,
        default:'no-photo.jpg'
    },
    housing: {
        type: Boolean,
        default: false
      },
      jobAssistance: {
        type: Boolean,
        default: false
      },
      jobGuarantee: {
        type: Boolean,
        default: false
      },
      acceptGi: {
        type: Boolean,
        default: false
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
    user: {
     type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  }
},{

    toJSON :{virtuals:true},
    toObject:{virtuals:true}
})

///Create bootcamp slug from name

BootcampSchema.pre('save', function(next){
    console.log('Slugify',this.name);
    this.slug=slugify(this.name,{lower:true})
    next()
})

//Geocod creTE LOACTION FIELD

BootcampSchema.pre('save',async function(next){
    const loc= await geocoder.geocode(this.address)
    console.log(loc);
    this.location={
        type:'Point',
        coordinates:[loc[0].longitude,loc[0].latitude],
        formattedAddress:loc[0].formattedAddress,
        street:loc[0].streetName,
        city:loc[0].city,
        state:loc[0].stateCode,
        zipcode:loc[0].zipcode,
        country:loc[0].countryCode,
    }

    //dont save address
    this.address=undefined

   next()
})

//Cascade Delete course when bootcamp is deleted

BootcampSchema.pre('remove',async function(next){
    await this.model('Course').deleteMany({bootcamp:this._id})
    next()
})

//Reserver populate with virtual

BootcampSchema.virtual('courses',{
    ref:'Course',
    localField:'_id',
    foreignField:'bootcamp',
    justOne:false
})

module.exports=mongoose.model('Bootcamp',BootcampSchema)