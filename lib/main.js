(function(){

  var DEFAULT_SOURCE =
    'https://github.com/kbparagua/dolphy-firefox/blob/master/source.md';

  var self = require('sdk/self'),
      pageMod = require('sdk/page-mod'),
      request = require('sdk/request').Request,
      ss = require('sdk/simple-storage');

  var scripts = [
    self.data.url('./js/vendors/jquery-2.1.3.min.js'),
    self.data.url('./js/dolphy.js'),
    self.data.url('./js/combo_listener.js'),
    self.data.url('./js/suggestion.js'),
    self.data.url('./js/lazyloader.js'),
    self.data.url('./js/core.js'),
    self.data.url('./js/init.js')
  ];

  var blankImageUrl = self.data.url('./images/blank.jpg');

  pageMod.PageMod({
    include: 'https://github.com/*',
    contentScriptFile: scripts,
    contentStyleFile: self.data.url('./css/style.css'),
    onAttach: function(worker){
      request({
        url: DEFAULT_SOURCE,
        onComplete: function(response){
          worker.port.emit('setSourceFromPage', response.text);
        }
      }).get();

      worker.port.emit('setBlankImageURL', blankImageUrl);
    }
  });

})();
