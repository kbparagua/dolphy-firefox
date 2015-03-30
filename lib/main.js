(function(){

  var DEFAULT_SOURCE =
    'https://raw.githubusercontent.com/kbparagua/' +
    'dolphy-firefox/master/data/default.json';

  var self = require('sdk/self'),
      pageMod = require('sdk/page-mod'),
      request = require('sdk/request').Request,
      ss = require('sdk/simple-storage');

  var scripts = [
    self.data.url('./js/vendors/jquery-2.1.3.min.js'),
    self.data.url('./js/dolphy.js'),
    self.data.url('./js/combo_listener.js'),
    self.data.url('./js/suggestion.js'),
    self.data.url('./js/core.js'),
    self.data.url('./js/init.js')
  ];

  var setSource = function(worker){
    worker.port.emit('setSource', ss.storage.source);
  };

  pageMod.PageMod({
    include: 'https://github.com/*',
    contentScriptFile: scripts,
    contentStyleFile: self.data.url('./css/style.css'),
    onAttach: function(worker){
      if ( ss.storage.source ) return setSource(worker);

      request({
        url: DEFAULT_SOURCE,
        onComplete: function(response){
          ss.storage.source = response.json;
          setSource(worker);
        }
      }).get();
    }
  });



})();
