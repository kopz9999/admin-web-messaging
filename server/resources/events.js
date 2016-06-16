exports.create = function(req, res){
  var algoliasearch = require('algoliasearch');
  var client = algoliasearch('V0L0EPPR59', 'b17514c9ce611a3cf95ff60382d796c5');
  var index = client.initIndex('events_log');
  index.addObject(req.body, function(err, content) {
    res.send(content);
  });
};
