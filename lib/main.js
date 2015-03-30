(function(){

  var self = require('sdk/self'),
      buttons = require('sdk/ui/button/action'),
      tabs = require("sdk/tabs"),
      pageMod = require('sdk/page-mod'),
      request = require('sdk/request').Request;

  var scripts = [
    self.data.url('./js/vendors/jquery-2.1.3.min.js'),
    self.data.url('./js/dolphy.js'),
    self.data.url('./js/combo_listener.js'),
    self.data.url('./js/suggestion.js'),
    self.data.url('./js/core.js'),
    self.data.url('./js/init.js')
  ];

  pageMod.PageMod({
    include: 'https://github.com/*',
    contentScriptFile: scripts,
    contentStyleFile: self.data.url('./css/style.css'),
    onAttach: function(worker){
      request({
        url: 'https://github.com/kbparagua/dolphy/blob/master/index.html',
        onComplete: function(response){ console.log(response.text); }
      }).get();

      worker.port.emit('setSource', {});
    }
  });

})();
