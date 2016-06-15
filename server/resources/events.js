exports.index = function(req, res){
  res.send('forum rxu');
};

exports.new = function(req, res){
  res.send('new forum');
};

exports.create = function(req, res){
  var algoliasearch = require('algoliasearch');
  var client = algoliasearch('V0L0EPPR59', 'b17514c9ce611a3cf95ff60382d796c5');
  var index = client.initIndex('events_log');
  index.addObject(req.body, function(err, content) {
    res.send(content);
  });
};

exports.show = function(req, res){
  res.send('show forum ' + req.params.forum);
};

exports.edit = function(req, res){
  res.send('edit forum ' + req.params.forum);
};

exports.update = function(req, res){
  res.send('update forum ' + req.params.forum);
};

exports.destroy = function(req, res){
  res.send('destroy forum ' + req.params.forum);
};
