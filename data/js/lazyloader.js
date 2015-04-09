(function(scope){

  var self = scope.Lazyloader = function(imgSelector){
    this._$container = null;
    this._imgSelector = imgSelector;
  };

  var p = self.prototype;


  p.listenTo = function($container){
    var _this = this;

    this._$container = $container;

    this._$container.on('scroll', function(){ _this._load(); });
    _this._load();
  };



  p._load = function(){
    var _this = this;

    $( this._imgSelector ).each(function(index, img){
      var $img = $(img),
          top = $img.position().top;

      if ( top < _this._$container.height() ){
        var realSource = $img.data('src');
        if ( $img.prop('src') === realSource ) return;

        $img.prop('src', realSource);
      }
    });
  };

})( this._Dolphy );
