const filterSortSelectPage = (Model, populate) => async (req, res, next) => {
  let query;
  let queryStr = { ...req.query };

  // Exclude keywords
  const keywords = ["select", "sort", "page", "limit"];
  keywords.forEach((kw) => delete queryStr[kw]);

  // Insert operators
  queryStr = JSON.stringify(queryStr);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/, (v) => `$${v}`);

  // Start buildiing query
  query = Model.find(JSON.parse(queryStr));

  // Select fields
  if (req.query.select) {
    const selectStr = req.query.select.split(",").join(" ");
    query = query.select(selectStr);
  }

  // Sort results
  if (req.query.sort) {
    const sortStr = req.query.sort.split(",").join(" ");
    query = query.sort(sortStr);
  } else {
    query = query.sort("-createdAt"); // default lastest first
  }

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const count = await Model.countDocuments();
  query = query.skip(startIndex).limit(limit);

  const pagination = {};
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }
  if (endIndex < count) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  query = query.populate(populate);

  const shops = await query.exec();

  res.queryResults = {
    success: true,
    count: shops.length,
    data: shops,
    pagination,
  };

  next();
};

module.exports = filterSortSelectPage;
