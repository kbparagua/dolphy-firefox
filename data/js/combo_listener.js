// NOTE:
// ASCII code to character:
// String.fromCharCode(ascii);

(function(scope){
  var INTERPRETATION_DELAY = 1000;

  var COMBO_STARTER_KEY = '?'.charCodeAt(0);
      VALID_KEYS = [COMBO_STARTER_KEY];

  //
  // TODO: Use Fucking REGEX!
  //
  var key = null,
      a = 'a'.charCodeAt(0),
      z = 'z'.charCodeAt(0),
      A = 'A'.charCodeAt(0),
      Z = 'Z'.charCodeAt(0),
      ZERO = '0'.charCodeAt(0),
      NINE = '9'.charCodeAt(0);

  for ( key = a; key <= z; key++ ) VALID_KEYS.push(key);
  for ( key = A; key <= Z; key++ ) VALID_KEYS.push(key);
  for ( key = ZERO; key <= NINE; key++ ) VALID_KEYS.push(key);




  var self = scope.ComboListener = function(){
    this._interpretationProcessId = null;
    this._$currentTarget = null;

    this._currentComboStart = -1;
    this._currentComboEnd = -1;

    this._onCombo = null;
  };


  var p = self.prototype;


  p.listenToAll = function(selector){
    var _this = this;

    $(document).on('keyup', selector, function(e){
      _this._interpretCombination(e);
    });
  };


  p.onCombo = function(callback){
    this._onCombo = callback;
  };


  p.replaceCurrentCombo = function(replacement){
    if ( !this._$currentTarget ) return;

    this._$currentTarget.focus();

    var value = this._$currentTarget.val(),
        leftPart = value.substring(0, this._currentComboStart),
        rightPart = value.substring(this._currentComboEnd + 1, value.length),
        newValue = leftPart + replacement + rightPart;

    this._$currentTarget.val(newValue);

    // Put selection cursor to the end of the replacement.
    var selectionCursor = this._currentComboStart + replacement.length;

    this._$currentTarget[0].selectionStart = selectionCursor;
    this._$currentTarget[0].selectionEnd = selectionCursor;
  };





  p._interpretCombination = function(event){
    var _this = this;

    this._$currentTarget = $(event.currentTarget);

    clearTimeout( this._interpretationProcessId );

    this._interpretationProcessId =
      setTimeout(
        function(){ _this._startInterpretation(); },
        INTERPRETATION_DELAY
      );
  };


  p._startInterpretation = function(){
    var value = this._$currentTarget.val();
    if ( $.trim(value) === '' ) return;

    var leftPart = this._getComboLeftPart(value),
        combination = leftPart + this._getComboRightPart(value);

    if ( !combination.length ) return;
    if ( combination.charCodeAt(0) !== COMBO_STARTER_KEY ) return;

    this._currentComboStart =
      this._$currentTarget[0].selectionStart -
      leftPart.length;

    this._currentComboEnd = this._currentComboStart + (combination.length - 1);

    // Remove combination starter character.
    combination = combination.substr(1, combination.length);

    if ( this._onCombo ){ this._onCombo(combination); }
  };


  p._getComboLeftPart = function(value){
    var i = this._$currentTarget[0].selectionStart - 1,
        leftPart = [];

    for ( ; i >= 0; i--){
      var character = value[i];
      if ( !character || !isValidCharacter(character) ) break;

      leftPart.push(character);
    }

    return leftPart.reverse().join('');
  };


  p._getComboRightPart = function(value){
    var i = this._$currentTarget[0].selectionStart,
        rightPart = [];

    for ( ; i < value.length; i++){
      var character = value[i];
      if ( !character || !isValidCharacter(character) ) break;

      rightPart.push(character);
    }

    return rightPart.join('');
  };


  var isValidCharacter = function(character){
    var key = character.charCodeAt(0);
    return VALID_KEYS.indexOf(key) >= 0;
  };

})( this._Dolphy );
