(function(global){

  global._Dolphy = global._Dolphy || {};

  //
  // Test Source
  //

  global._Dolphy.TEST_SOURCE = {
    'bruce': './test/bruce.jpg',
    'winner-dance': './test/winner-dance.gif',
    'kermit-type': './test/kermit-type.gif'
  };


  global._Dolphy.setSource = function(source){
    this._source = source;
  };


  // Temporary
  global._Dolphy.getSource = function(){
    return this._source || this.TEST_SOURCE;
  };



  self.port.on('setSource', function(source){
    global._Dolphy.setSource(source);
  });


})(this);
