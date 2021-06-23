// const axios = require('axios');
const https = require("https");
const package = require('./package.json');

const queryParams = {
    msgtype: 'link',
    link: {
        text: package.version,
        title: package.name+' 框架发版了',
        picUrl: '',
        messageUrl: 'http://share.ark.burgeononline.com/knowledge/documentation_58582'
    }
};
const requestData = JSON.stringify(queryParams);
var options = {
    hostname: 'oapi.dingtalk.com',
    port: 443,
    path: '/robot/send?access_token=4ffc4bb4cc16400656ca42cb255e3af33fa5c121a2cbfba9cbe85632eb1c30d7',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
};
var request = https.request(options, function(response) {
    response.setEncoding('utf8');
    response.on('data', function(data) {
        console.log(data);    
    });

    response.on('end', function() {
       
    });
});
request.on('error', function(res){
    console.log(res);

});

request.write(requestData);
request.end();