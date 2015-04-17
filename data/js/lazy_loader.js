(function(scope){

  var DELAY = 500;


  var self = scope.LazyLoader = function(imgSelector){
    this._$container = null;
    this._imgSelector = imgSelector;

    this._id = null;
  };

  var p = self.prototype;


  p.listenTo = function($container){
    var _this = this;

    this._$container = $container;

    this._$container.on('scroll', function(){
      clearTimeout( _this._id );
      _this._id = setTimeout(function(){ _this.loadImages(); }, DELAY);
    });

    this.loadImages();
  };



  p.loadImages = function(){
    console.log('------------------------------------------');
    console.log('LOADING');
    console.log('Container height: ' + this._$container.height());
    console.log('------------------------------------------');

    var _this = this;

    $( this._imgSelector ).each(function(index, img){
      var $img = $(img),
          top = $img.position().top,
          alt = $img.prop('alt');

      console.log(':' + alt);
      console.log('  -> top: ' + top);

      if ( top < _this._$container.height() && top >= 0 ){
        var realSource = $img.data('url');

        if ( $img.prop('src') === realSource ) return;
        console.log('  -> LOAD!');

        $img.prop('src', realSource);
      }
    });
  };

})( this._Dolphy );
