// @desc   Logs reuest


const logger=(req,res,next)=>{

    req.hello='Hello'
    console.log(`${req.method} ${req.protocol}://${req.get('host')}`);
    next()
}



module.exports=logger