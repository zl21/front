const config = {
    user: 'frontend',  // 在jenkins的用户名
    token: '11a39baa0df576eb933c97f50f0e9c6ac2',  // 在第一步生成的token长字符串
    baseUrl: 'jks.burgeononline.com'  // jenkins项目的域名。不要带协议和端口
  }
   
  const url = `https://${config.user}:${config.token}@${config.baseUrl}`
   
  //生成一个jenkins连接对象
  // crumbIssuer 默认 false, true 启用CSRF保护支持。也可以不开
  const jenkins = require('jenkins')({ url, crumbIssuer: true }) 
  jenkins.job.build('syman-r3-form', function(err, data) {
    if (err) throw err;
   
    console.log('queue item number', data);
  }); 
 