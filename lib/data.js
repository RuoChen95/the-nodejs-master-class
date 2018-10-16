// 用于储存和**编辑**数据
var fs = require('fs');
var path = require('path');

// 定义数据
var lib = {};

lib.baseDir = path.join(__dirname, '/../.data');

// 增
lib.create = function(dir,file,data,callback){
    // 打开文件
    fs.open(lib.baseDir+'/'+dir+'/'+file+'.json', 'wx', function(err, fileDescriptor){
        if (!err && fileDescriptor) {
            // 将传入数据转换为字符串
            var stringData = JSON.stringify(data);
            
            // 写入数据
            console.log('写入数据..')
            fs.writeFileSync(fileDescriptor, stringData, function(err) {
                if (!err) {
                    fs.close(fileDescriptor, function (err) {
                        if (!err) {
                            callback(false)
                        } else {
                            callback('Error closing new file');
                        }
                    })
                } else {
                    callback('Error writing to new file');
                }
            })
        } else {
            callback('Could not create new file, it may already exist');
        }
    })
}

// 删
lib.delete = function(dir, file, callback) {
    fs.unlink(lib.baseDir+'/'+dir+'/'+file+'.json', function (err,data) {
        callback(err, data)
    })
}

// 改
lib.update = function(dir, file, data, callback) {
    fs.open(lib.baseDir+'/'+dir+'/'+file+'.json', 'r', function(err, fileDescriptor){
        if (!err && fileDescriptor) {
            var stringData = JSON.stringify(data);

            fs.truncate(fileDescriptor,function(err){
                if(!err){
                  // Write to file and close it
                  fs.writeFile(fileDescriptor, stringData,function(err){
                    if(!err){
                      fs.close(fileDescriptor,function(err){
                        if(!err){
                          callback(false);
                        } else {
                          callback('Error closing existing file');
                        }
                      });
                    } else {
                      callback('Error writing to existing file');
                    }
                  });
                } else {
                  callback('Error truncating file');
                }
              });
        } else {
            console.log(123123123)
            callback('Could not create new file, it may already exist');
        }
    })
}

// 查
lib.read = function(dir, file, callback) {
    fs.readFile(lib.baseDir+'/'+dir+'/'+file+'.json', 'utf8', function (err,data) {
        callback(err, data)
    })
}

// 输出数据
module.exports = lib;