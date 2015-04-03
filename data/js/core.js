(function(scope){

  var TEXTAREA_SELECTORS = ['.js-comment-field'];


  var self = scope.Core = function(){
    this._suggestion = new scope.Suggestion();
    this._comboListener = new scope.ComboListener();
  };


  self.prototype.start = function(){
    var _this = this;

    this._comboListener.listenToAll( TEXTAREA_SELECTORS.join(', ') );

    this._showSuggestionsOnCombo();
    this._hideSuggestionsOnOutsideClick();
    this._updateTextOnSuggestionSelect();
  };


  self.prototype._showSuggestionsOnCombo = function(){
    var _this = this;

    this._comboListener.onCombo(function(combo){
      if ( !_this._suggestion.isRendered() ) _this._suggestion.render();

      console.log('show suggestions for combo: ' + combo);
      _this._suggestion.show(combo);
    });
  };

  self.prototype._hideSuggestionsOnOutsideClick = function(){
    var _this = this;

    $(document).on('click', function(e){
      if ( _this._suggestion.isHidden() ) return;

      var $target = $(e.target);

      // Hide suggestions if element clicked is outside the
      // suggestions panel.
      if ( !$target.hasClass( scope.Suggestion.ELEMENTS_CLASS_NAME ) ){
        _this._suggestion.hide();
      }
    });
  };


  self.prototype._updateTextOnSuggestionSelect = function(){
    var _this = this;

    this._suggestion.onSelect(function(combo, url){
      var comboPart = ['[', combo, ']'].join(''),
          urlPart = ['(', url, ')'].join(''),
          markdown = ['!', comboPart, urlPart].join('');

      _this._comboListener.replaceCurrentCombo(markdown);

      _this._suggestion.hide();
    });
  };

})( this._Dolphy );
