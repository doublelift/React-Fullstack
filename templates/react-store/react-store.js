'use strict';

var AppDispatcher = require('../dispatchers/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/AppConstants');
var merge = require('react/lib/merge');
var Q = require('q');

var CHANGE_EVENT = 'change';

var _data = {
  todos: []
};

// {item:'React', id: 0},
//     {item:'Flux', id: 1},
//     {item:'Gulp', id: 2},
//     {item:'Express Server', id: 3},
//     {item: 'Mongo Database', id: 4}
var staticPromise = function(params){
  var output = Q.defer();
  Q.resolve(params);
  return Q.promise;
}

var httpGet = function(url){
  var output = Q.defer();
  $.ajax({
    type: 'GET',
    url: url
  }).success(function(data){
    for (var i = 0; i < data.length; i++) {
      data[i].id = i;
    };
    _data.todos = data;
    output.resolve(data);
  }).error(function(error){
    output.reject(error);
  });
  return output.promise;
}
var <?? classifiedStoreName ?>Store = merge(EventEmitter.prototype, {

  getInitialData: function(){
    return _data;
  },

  getData: function(){
    return httpGet('/api/<?? classifiedStoreName ?>');
  },


  emitChange: function(){
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback){
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback){
    this.removeListener(CHANGE_EVENT, callback);
  }
});

AppDispatcher.register(function(payload){
  var action = payload.action;

  if(action.actionType === AppConstants.POPULATE) {
    return <?? classifiedStoreName ?>Store.getData();
  }

  if(action.actionType === AppConstants.ADD){

    //Find out how many elements are in the todo.
    //Make new todo - id = highest id +1, message = name
    //Submit Post Req
    //On Success, getData?
    var id;
    if (_data.todos.length > 0) {
      id = _data.todos[_data.todos.length-1].id + 1;
    } else {
      id = 0;
    }
    var temp = {item: action.text, id: id};
    _data.todos.push(temp);
    <?? classifiedStoreName ?>Store.emitChange();
    $.ajax({
      type: 'POST',
      data: JSON.stringify(temp),
      contentType: 'application/json',
      url: '/api/<?? classifiedStoreName ?>/',
      success: function(item) {
        console.log('db reconciled with memory. added:', item);
        <?? classifiedStoreName ?>Store.getData();
      },
      failure: function(item) {
        console.log('db failed to reconciled with memory.');
        <?? classifiedStoreName ?>Store.getData();
        //Maybe add some Visual To improve user experience e.g. a sorry message
      }
    });
  }



  if(action.actionType === AppConstants.REMOVE){
    console.log(action)
    console.log(_data.todos)

    for (var i = 0; i < _data.todos.length; i++) {
      console.log(action.id);
      if (_data.todos[i].id === action.id) {
        var temp = _data.todos.splice(i, 1);
        <?? classifiedStoreName ?>Store.emitChange();
        console.log(temp[0]['_id'])
        //AJAX GET passing in n
        return $.ajax({
          type: 'DELETE',
          url: '/api/<?? classifiedStoreName ?>/' + temp[0]['_id'],
          success: function(item){
            console.log('item removed successfully');
            console.log(item)
            <?? classifiedStoreName ?>Store.emitChange();
          },
          failure: function(failure){
            console.log('item remove failed', failure);
            <?? classifiedStoreName ?>Store.getData();
            <?? classifiedStoreName ?>Store.emitChange();
          },
        });
        break;
      }
    }
  }

  <?? classifiedStoreName ?>Store.emitChange();

});



module.exports = <?? classifiedStoreName ?>Store;
