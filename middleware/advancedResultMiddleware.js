const advancedResults = (model) => async (req, res, next) => {
  let query;
//  "chatBetween": {$eq : [req.user.id,req.params.id]}
  query = model.find({
    $or :[{chatBetween: {$eq : [req.user.id,req.params.receiverId]}}, {chatBetween: {$eq : [req.params.receiverId,req.user.id]}}],
    whoShouldSee: {$in : [req.user.id]}
  });

  query.sort("-createdAt");
 
  //for pagination and limit
  //the parseInt() is because req.query is a string, so we convert to a number
  //NB this executes as a default

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 15;
  const startIndex = (page - 1) * limit; //more like a skip so so number of queries b4 doin anytn
  const endIndex = page * limit;
  const total = await model.countDocuments();

  query.skip(startIndex).limit(limit).sort("createdAt");

  //executing the query
  const results = await query;
  const pagination = {};

  //to check if there would be a next page
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  //to check if there would be a last page

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }
  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results
  };
  next();
};

module.exports = advancedResults;
