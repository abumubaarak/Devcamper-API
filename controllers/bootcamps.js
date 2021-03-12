// @desc   GET All bootcamps
// @route  GET /api/v1/bootcamps
// @access Public
exports.getBootcamps = (req, res, next) => {
  res
    .status(200)
    .json({ sucess: true, msg: "show all bootcamps"});
};

// @desc   GET Single bootcamps
// @route  GET /api/v1/bootcamps/:id
// @access Public
exports.getBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ sucess: true, msg: `show bootcamps ${req.params.id}` });
};

// @desc   Create new  bootcamps
// @route  POST /api/v1/bootcamps/
// @access Private
exports.createBootcamp = (req, res, next) => {
  res.status(201).json({ sucess: true, msg: "create new bootcamps" });
};

// @desc   Update   bootcamps
// @route  PUT /api/v1/bootcamps/:id
// @access Private
exports.updateBootcamp = (req, res, next) => {
  res
    .status(201)
    .json({ success: true, msg: `Update bootcamps ${req.params.id}` });
};

// @desc   Delete   bootcamps
// @route  DELETE /api/v1/bootcamps/:id
// @access Private
exports.deleteBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ sucess: true, msg: `delete bootcamp ${req.params.id}` });
};
