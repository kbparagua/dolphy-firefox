(function(scope){


  var BLANK_IMG_URL = null;

  self.port.on('setBlankImageURL', function(url){
    BLANK_IMG_URL = url;
  });



  var RETURN_KEY = 13,
      ARROW_UP_KEY = 38,
      ARROW_DOWN_KEY = 40;

  var ANIMATION_DELAY = 100,
      RIGHT_MARGIN = 20;

  var OPTION_BORDER_WIDTH = 5;


  var _self = scope.Suggestion = function(){
    this._currentCombo = null;

    this.$body = $(document.body);
    this.$el = null;
    this.$comboBox = null;
    this.$optionsContainer = null;
    this.$options = null;
    this._width = 0;

    this._rendered = false;
    this._shown = false;
    this._onSelect = null;
  };


  _self.ELEMENTS_CLASS_NAME = 'dolphy';
  _self.ELEMENT_CLASS = '.' + _self.ELEMENTS_CLASS_NAME;





  var p = _self.prototype;


  p.render = function(){
    this._buildElements();

    $(document.body).append( this.$el );

    // Add event listeners.
    this._updateOptionsOnComboChange();
    this._selectOptionOnClick();
    this._selectOptionOnEnter();
    this._focusOptionWithArrowKeys();
    this._focusOptionOnHover();

    var lazyloader = new scope.Lazyloader('.js-dolphy-img');
    lazyloader.listenTo( this.$optionsContainer );

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
  // Event Handlers
  //
  //

  p._updateOptionsOnComboChange = function(){
    var _this = this;

    this.$comboBox.on('keyup', function(){
      var comboBoxValue = _this.$comboBox.val();

      if ( _this._currentCombo === comboBoxValue ) return;

      _this._currentCombo = comboBoxValue;
      _this._updateOptions();
    });
  };


  p._focusOptionWithArrowKeys = function(){
    var _this = this;

    this.$el.on('keydown', function(e){
      var key = e.which;

      if ( [ARROW_UP_KEY, ARROW_DOWN_KEY].indexOf(key) < 0 ) return;

      e.preventDefault();

      var $focused = _this._$focusedOption();
      var $focusOn =
            key === ARROW_UP_KEY ?
              $focused.prev('.js-dolphy-option') :
              $focused.next('.js-dolphy-option');

      if ( !$focusOn.length ) return;

      var optionTop = ($focusOn.position().top - OPTION_BORDER_WIDTH),
          currentScrollTop = _this.$optionsContainer.scrollTop(),
          newTop = optionTop + currentScrollTop;

      _this._focusOption($focusOn);
      _this.$optionsContainer.animate(
        {scrollTop: newTop},
        ANIMATION_DELAY
      );
    });
  };


  p._selectOptionOnClick = function(){
    var _this = this;

    this.$options.on('click', '.js-dolphy-option', function(e){
      var $option = $(e.currentTarget),
          $img = $option.find('.js-dolphy-img:first'),
          $combo = $option.find('.js-dolphy-combo:first'),
          url = $img.prop('src'),
          combo = $combo.text();

      e.preventDefault();

      if ( _this._onSelect ){ _this._onSelect(combo, url); }
    });
  };


  p._selectOptionOnEnter = function(){
    var _this = this;

    this.$el.on('keypress', function(e){
      if ( e.which !== RETURN_KEY ) return;

      e.preventDefault();

      var $focused = _this._$focusedOption();
      if ( $focused.length ) $focused.trigger('click');
    });
  };


  p._focusOptionOnHover = function(){
    var _this = this;

    this.$options.on('mouseover', '.js-dolphy-option', function(){
      _this._focusOption( $(this) );
    });
  };





  //
  //
  // Visibility
  //
  //

  p.show = function(combo){
    this._currentCombo = combo;

    var _this = this,
        bodyNewLeft = this._width + RIGHT_MARGIN;

    this.$comboBox.val(combo);

    this.$el.animate({left: 0}, ANIMATION_DELAY, function(){
      _this.$comboBox.focus();
      _this.$comboBox[0].selectionStart = combo.length;
      _this._shown = true;

      _this._updateOptions();
    });


    this.$body.animate({'padding-left': bodyNewLeft}, ANIMATION_DELAY);
  };


  p.hide = function(){
    var _this = this,
        hiddenPostion = -(this._width + RIGHT_MARGIN);

    this.$el.animate({left: hiddenPostion}, ANIMATION_DELAY, function(){
      _this._shown = false;
    });

    this.$body.animate({'padding-left': 0}, ANIMATION_DELAY);
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

  p._$focusedOption = function(){
    return this.$options.find('.js-dolphy-option.focus:first');
  };


  p._focusOption = function($option){
    this.$options.find('.js-dolphy-option').removeClass('focus');
    $option.addClass('focus');
  };


  p._updateOptions = function(){
    var options = this._options();
    this.$options.empty();

    for ( var combo in options ) this._appendOption(combo, options[combo]);

    var $first = this.$options.find('.js-dolphy-option:first');
    if ( $first.length ) this._focusOption($first);

    this.$optionsContainer.scrollTop(0);
  };


  p._appendOption = function(combo, url){
    var $option = $('<a>', {class: buildClasses('option'), href: '#'}),
        $combo = $('<a>', {class: buildClasses('combo'), href: '#'});

    var $img =
      $('<img>', {
        class: buildClasses('img'),
        'data-url': url,
        src: BLANK_IMG_URL,
        alt: combo
      });

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
    this.$el = $('<div>', {class: buildClasses('suggestion')});

    this.$optionsContainer =
      $('<div>', {class: buildClasses('options-container') });

    this.$options = $('<div>', {class: buildClasses('options')});

    this.$optionsContainer.append( this.$options );

    this.$comboBox =
      $('<input>', {
        type: 'text',
        class: buildClasses('combo-box')
      });

    this.$el.append( this.$comboBox ).append( this.$optionsContainer );
  };


  var buildClasses = function(base){
    var css = 'dolphy-' + base,
        js = 'js-' + css;

    return [_self.ELEMENTS_CLASS_NAME, js, css].join(' ');
  };

})( this._Dolphy );
