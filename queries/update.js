
module.exports.put = (req, res, next) => {
  res.send(201, 'updated Communications');
  next();
};
