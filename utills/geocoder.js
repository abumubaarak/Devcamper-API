const nodeGeocoder = require("node-geocoder");
const dotenv= require('dotenv')

dotenv.config({path:'./config/config.env'})

console.log(process.env.GEOCODER_PROVIDER);
const options = {
  httpAdapter: "https", 
   provider: process.env.GEOCODER_PROVIDER,
  apiKey: process.env.GEOCODER_API_KEY, // or Mapquest, OpenCage, Google Premier
  formatter: null, // 'gpx', 'string', ...
};

const geocoder = nodeGeocoder(options);

// Using callbac

module.exports = geocoder;
