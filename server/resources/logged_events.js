exports.create = function(req, res){
  var algoliasearch = require('algoliasearch');
  var client = algoliasearch('V0L0EPPR59', 'b17514c9ce611a3cf95ff60382d796c5');
  var index = client.initIndex('events_log');
  var loggedEvent = req.body.event;
  var event, user, page, site;
  if (loggedEvent) {
    user = { id: loggedEvent.uuid, layer_id: loggedEvent.uuid,
      display_name: loggedEvent.name };
    page = { full_url: loggedEvent.url };
    if (loggedEvent.data && loggedEvent.data.title) {
      page.name = loggedEvent.data.title;
    }
    site = { domain: loggedEvent.domain };
    event = { logged_at: Date.now(), site: site, user: user,
      page: page, type: 'VISIT' };
    index.addObject(event, function(err, content) {
      res.send(content);
    });
  } else {
    res.status(422);
    res.send({ message: 'Unknown content'});
  }
};
