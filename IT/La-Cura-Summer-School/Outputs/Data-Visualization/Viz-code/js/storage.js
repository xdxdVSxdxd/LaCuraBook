function Storage() {
  
  var storage = [];

  this.clearStorage = function() {
    storage = [];
  };

  this.erase = function(data) {
    for(var i = 0; i < storage.length; i++){
      if( storage[i].id === data.id ) {
        storage.splice(i, 1);
      }
    }
  };

  this.store = function(data) {
    storage.push(data);
  };
  
  this.check = function(data) {
    var isInStorage = this.isInStorage(data);
    return (isInStorage !== undefined);
  }

  this.update = function(isInStorage, data, isOverallLast){

    var isWildcard = data.id === 0 && data.label === 'all';
    var removeWildcard = false;

    // if the incoming data is the wildcard
    if( isWildcard ) {
      // if it wasn't in the storage
      if( !isInStorage ) {
        // clear the whole storage
        this.clearStorage();
        // store the wildcard
        this.store(data);
      }
    } else {
      // if it wasn't in the storage
      if( !isInStorage ) {
        // if the wildcard is in storage
        if( this.isWildcardInStorage() ) {
          // erase it
          this.erase({id: 0});
          removeWildcard = true;
        }
        // then store data
        this.store(data)
      } else { 
        // if it's not the last item in the storage
        if( !this.isLastItem() || !isOverallLast ) {
          // erase it
          this.erase(data);
        }
      }
    }
    return {isWildcard: isWildcard, remove: removeWildcard};
  };

  this.get = function() {
    return storage;
  };

  this.isEmpty = function() {
    return storage.length === 0;
  };

  this.isLastItem = function() {
    return storage.length === 1;
  };

  this.isInStorage = function(data) {
    var isInStorage = storage.find(function(el) {
      return el.id === data.id;
    });
    return isInStorage;
  };

  this.isWildcardInStorage = function() {
    var isInStorage = storage.find(function(el) {
      return el.id === 0 && el.label === 'all';
    });
    return isInStorage !== undefined;
  }
  
  return this;
}