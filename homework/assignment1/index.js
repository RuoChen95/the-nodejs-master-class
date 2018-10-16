const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');


// 定义服务
var httpServer = http.createServer((req, res) => {
    myServer(req,res)
})

// 启动服务，并动态监听接口
httpServer.listen(config.httpPort, () => {
    console.log('listening on', config.httpPort, config.envName);
});

// 定义路由处理函数对象
var handlers = {};

handlers.hello = function(data, callback) {
    callback(200, {'name': 'sample handler'});
}

handlers.notFount = function(data, callback) {
    callback(404);
};

// 请求主体
var myServer = function (req, res) {
    // 获取url
    var parseUrl = url.parse(req.url, true);

    // 获取url的内容
    var path = parseUrl.pathname;
    var trimmedPath = path.replace(/^\/+/g, ''); // 去除开头的“/”

    // 获取http方法
    var method = req.method.toLowerCase()

    // 获取url带的参数
    var queryStringObject = parseUrl.query;

    // 获取头部信息
    var headers = req.headers

    // 获取payload
    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data', function(data) {
        buffer += decoder.write(data)
    })
    req.on('end', function() {
        buffer += decoder.end();

        // 选择路由
        var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFount;

        var data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': buffer
        };
        
        // ?
        chosenHandler(data, function(statusCode, payload) {

            statusCode = typeof(statusCode) == 'number' ? statusCode : 200

            payload = typeof(payload) == 'object' ? payload : {};

            var payloadString = JSON.stringify(payload);

            // 显示
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString, 'Hello World\n')
            console.log(`request received on 
            path ${path}, 
            trimmedPath ${trimmedPath},
            method ${method}`)
            console.log(queryStringObject)
            console.log(headers)
            console.log(buffer, statusCode, payloadString)
        })
    })
}


// 定义请求路由
var router = {
    'hello': handlers.hello
};