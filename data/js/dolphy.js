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


  // Temporary
  global._Dolphy.getSource = function(){
    return this.TEST_SOURCE;
  };

})(this);
