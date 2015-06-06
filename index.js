var fs = require('fs');
var koa = require('koa');
var wechat = require('co-wechat');
var WechatAPI = require('co-wechat-api');
var config = require('./weixin.json');

var app = koa();
var api = new WechatAPI(config.appid, config.appsecret, function (callback) {
  fs.readFile('access_token.txt', 'utf8', function (err, txt) {
    if (err) {
      return callback(err);
    }
    callback(null, JSON.parse(txt));
  });
}, function (token, callback) {
  // 请将token存储到全局，跨进程、跨机器级别的全局，比如写到数据库、redis等
  // 这样才能在cluster模式及多机情况下使用，以下为写入到文件的示例
  fs.writeFile('access_token.txt', JSON.stringify(token), callback);
});

app.use(wechat({
  token: config.token,
  appid: config.appid,
  encodingAESKey: config.encodingAESKey
}).middleware(function* () {
  // 微信输入信息都在this.weixin上
  var message = this.weixin;

  if (message.Content && message.Content.toUpperCase() === 'KF') {
    this.body = {
      type: "customerService",
      kfAccount: "gxcsoccer"
    };
  } else {
    var user = yield api.getUser(message.FromUserName);
    this.body = [{
      title: '成都娃娃',
      description: '您好，' + user.nickname + '！ 欢迎来到成都娃娃的地盘',
      picurl: 'https://s-media-cache-ak0.pinimg.com/originals/e5/fe/b3/e5feb38ffdaafe527ba5d963e0035b73.jpg',
      url: 'http://gxcsoccer.github.io/'
    }];
  }
}));

app.listen(80);