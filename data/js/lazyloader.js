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
    console.log('---------------------------------------------------');
    console.log('LOADING');
    console.log('Viewable Area: 0 - ' + this._$container.height());
    console.log('---------------------------------------------------');

    var _this = this;

    $( this._imgSelector ).each(function(index, img){
      var $img = $(img),
          top = $img.position().top,
          alt = $img.prop('alt');

      console.log('checking image: ' + alt + ', top: ' + top);

      if ( top < _this._$container.height() && top >= 0 ){
        var realSource = $img.data('url');

        console.log('--> entered viewable area');

        if ( $img.prop('src') === realSource ) return;
        console.log('--> LOAD!');

        $img.prop('src', realSource);
      }
    });
  };

})( this._Dolphy );
