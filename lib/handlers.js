// 需要的东西
var _data = require('./data');
var helpers = require('./helpers');


// 定义路由处理函数对象
var handlers = {};

// handlers.sample = function(data, callback) {
//     // 回调一个http code以及数据
//     callback(406, {'name': 'sample handler'});
// };

handlers.users = function(data,callback){
    var acceptableMethods = ['post','get','put','delete'];
    if(acceptableMethods.indexOf(data.method) > -1){
        handlers._users[data.method](data,callback);
    } else {
        callback(405);
    }
};
  


handlers.ping = function(data, callback) {
    callback(200, {});
}

handlers.notFount = function(data, callback) {
    callback(404);
};

// 面向对象思想
handlers._users  = {};

handlers._users.post = function(data,callback){
    // Check that all required fields are filled out
    var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    var tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;
  
    if(firstName && lastName && phone && password && tosAgreement){
      // Make sure the user doesnt already exist
      _data.read('users',phone,function(err,data){
        if(err){
          // Hash the password
          var hashedPassword = helpers.hash(password);
  
          // Create the user object
          if(hashedPassword){
            var userObject = {
              'firstName' : firstName,
              'lastName' : lastName,
              'phone' : phone,
              'hashedPassword' : hashedPassword,
              'tosAgreement' : true
            };
  
            // Store the user
            _data.create('users',phone,userObject,function(err){
              if(!err){
                callback(200);
              } else {
                callback(500,{'Error' : 'Could not create the new user'});
              }
            });
          } else {
            callback(500,{'Error' : 'Could not hash the user\'s password.'});
          }
  
        } else {
          // User alread exists
          callback(400,{'Error' : 'A user with that phone number already exists'});
        }
      });
  
    } else {
      callback(400,{'Error' : 'Missing required fields'});
    }
  
  };



module.exports = handlers;