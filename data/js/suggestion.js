(function(scope){

  var ANIMATION_DELAY = 150;

  var self = scope.Suggestion = function(){
    this.$el = null;
    this.$comboBox = null;
    this.$options = null;
    this._width = 0;

    this._rendered = false;
    this._shown = false;
    this._onSelect = null;
  };


  self.ELEMENTS_CLASS_NAME = 'dolphy';
  self.ELEMENT_CLASS = '.' + self.ELEMENTS_CLASS_NAME;





  var p = self.prototype;


  p.render = function(){
    var _this = this;

    this._buildElements();

    $(document.body).append( this.$el );

    this.$comboBox.on('keyup', function(){ _this._updateOptions(); });

    this.$options.on('click', '.js-dolphy-option', function(e){
      var $option = $(e.currentTarget),
          $img = $option.find('.js-dolphy-img:first'),
          $combo = $option.find('.js-dolphy-combo:first'),
          url = $img.prop('src'),
          combo = $combo.text();

      if ( _this._onSelect ){ _this._onSelect(combo, url); }
    });

    this._width = this.$el.width();
    this._rendered = true;
  };


  p.isRendered = function(){
    return this._rendered;
  };


  p.onSelect = function(fx){
    this._onSelect = fx;
  };





  //
  //
  // Visibility
  //
  //

  p.show = function(combo){
    var _this = this;

    this.$comboBox.val(combo);

    this.$el.animate({left: 0}, ANIMATION_DELAY, function(){
      _this.$comboBox.focus();
      _this.$comboBox[0].selectionStart = combo.length;
      _this._shown = true;

      _this._updateOptions();
    });
  };


  p.hide = function(){
    var _this = this;

    this.$el.animate({left: -this._width}, ANIMATION_DELAY, function(){
      _this._shown = false;
    });
  };


  p.isShown = function(){
    return this._shown;
  };


  p.isHidden = function(){
    return !this.isShown();
  };





  //
  //
  // Options
  //
  //

  p._updateOptions = function(){
    var options = this._options();
    this.$options.empty();

    for ( var combo in options ) this._appendOption(combo, options[combo]);
  };


  p._appendOption = function(combo, url){
    var $option = $('<div>', {class: buildClasses('option')}),
        $combo = $('<div>', {class: buildClasses('combo')}),
        $img = $('<img>', {class: buildClasses('img'), src: url});

    $option.append($img);
    $option.append($combo);

    $combo.text(combo);

    this.$options.append($option);
  };


  // What are the available options.
  p._options = function(){
    var source = scope.getSource(),
        combo = this.$comboBox.val(),
        matches = {};

    for ( var key in source ){
      if ( key.indexOf(combo) < 0 ) continue;

      matches[key] = source[key];
    }

    return matches;
  };





  p._buildElements = function(){
    var classes = {
      el: 'suggestion',
      comboBox: 'combo-box',
      options: 'options'
    };

    this.$el = $('<div>', {class: buildClasses( classes.el )});
    this.$options = $('<div>', {class: buildClasses( classes.options )});
    this.$comboBox =
      $('<input>', {
        type: 'text',
        class: buildClasses( classes.comboBox )
      });

    this.$el.append( this.$comboBox ).append( this.$options );
  };


  var buildClasses = function(base){
    var css = 'dolphy-' + base,
        js = 'js-' + css;

    return [self.ELEMENTS_CLASS_NAME, js, css].join(' ');
  };

})( this._Dolphy );
