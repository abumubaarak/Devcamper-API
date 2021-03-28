const advancedResults = (model, populate) => async (req, res, next) => {
    let query;

    const reqQuery = { ...req.query };
  
    //field to exclude
    const removeFields = ["select", "sort", "page", "limit"];
  
    console.log(reqQuery);
  
    //Loop over removeFields and delete from them
    removeFields.forEach((param) => delete reqQuery[param]);
  
    console.log(reqQuery);
  
    let queryStr = JSON.stringify(reqQuery);
  
    
    //Create operations
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );
  
    query = model.find(JSON.parse(queryStr))
  
    //Selet fields
    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ");
      query = query.select(fields);
    }
  
    if (req.query.sort) {
      const sort = req.query.sort.split(",").join(" ");
      query = query.sort(sort);
    } else {
      query = query.sort("-createdAt");
    }
  
    //Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();
  
    query = query.skip(startIndex).limit(limit);
  
    if(populate){
        query=query.populate(populate)
    }
    //Pagegination Result
  
    const pagination = {};
  
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }
  
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }
  
    const results = await query;

    res.advancedResults={
        success:true,
        count:results.length,
        pagination,
        data:results
    }

    next()
};

module.exports = advancedResults;
