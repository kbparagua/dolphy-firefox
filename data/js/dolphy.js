(function(global){

  global._Dolphy = global._Dolphy || {};


  global._Dolphy.setSource = function(page){
    var source = {};

    var $page = $('<div>');;
    $page.html(page);

    var $markdown = $page.find('.blob:first'),
        $imgs = $markdown.find('img');

    $imgs.each(function(_, img){
      var $img = $(img);
      source[ $img.prop('alt') ] = $img.prop('src');
    });

    this._source = source;
  };


  // Temporary
  global._Dolphy.getSource = function(){
    return this._source;
  };





  self.port.on('setSourceFromPage', function(page){
    global._Dolphy.setSource(page);
  });


})(this);
