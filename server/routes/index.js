exports.index = function(req, res){
  res.render('index');
};

exports.topic = function(req, res){
  res.render('topic');
};

exports.slide = function(req, res) {
  var id = req.param('id');
  res.render('slide' + id);
};
