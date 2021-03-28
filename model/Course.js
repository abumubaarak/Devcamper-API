const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Plsease add a course title"],
  },
  description: {
    type: String,
    required: [true, "Plsease add a description"],
  },
  weeks: {
    type: String,
    required: [true, "Please add number of weeks"],
  },
  tuition: {
    type: Number,
    required: [true, "Plsease add tuition cost"],
  },
  minimumSkill: {
    type: String,
    required: [true, "Plsease add a minimum skill"],
    enum: ["beginner", "intermediate", "advanced"],
  },
  scholarShipAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }, 
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
   ref: "User",
   required: true,
 }
});

//Static meyhod to get avg cost tuttions
CourseSchema.statics.getAverageCost = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
        $group:{
            _id:'$bootcamp',
            averageCost:{$avg:'$tuition'}
        }
    },
  ]);

  try {
      await this.model('Bootcamp').findByIdAndUpdate(bootcampId,{
          averageCost:Math.ceil(obj[0].averageCost/10)*10
      })
  } catch (error) {
      console.error(error)
  }
 };

//Call getAverageCost After save
CourseSchema.post("save", function () {
    this.constructor.getAverageCost(this.bootcamp)
});

//Call getAverageCost before remove
CourseSchema.pre("remove", function () {
    this.constructor.getAverageCost(this.bootcamp)

});

module.exports = mongoose.model("Course", CourseSchema);
