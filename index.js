var koa = require('koa');
var wechat = require('co-wechat');

var app = koa();

app.use(wechat({
  token: 'gxcsoccer',
  appid: 'wxa225e271c9821fb7',
  encodingAESKey: 'bbp256iKEBvLy5dG4Q20sYEQvFIxqqq9e43fXCf148N'
}).middleware(function* () {
  // 微信输入信息都在this.weixin上
  var message = this.weixin;
  if (message.FromUserName === 'diaosi') {
    // 回复屌丝(普通回复)
    this.body = 'hehe';
  } else if (message.FromUserName === 'text') {
    //你也可以这样回复text类型的信息
    this.body = {
      content: 'text object',
      type: 'text'
    };
  } else if (message.FromUserName === 'hehe') {
    // 回复一段音乐
    this.body = {
      type: "music",
      content: {
        title: "来段音乐吧",
        description: "一无所有",
        musicUrl: "http://mp3.com/xx.mp3",
        hqMusicUrl: "http://mp3.com/xx.mp3"
      }
    };
  } else if (message.FromUserName === 'kf') {
    // 转发到客服接口
    this.body = {
      type: "customerService",
      kfAccount: "test1@test"
    };
  } else {
    // 回复高富帅(图文回复)
    this.body = [{
      title: '你来我家接我吧',
      description: '这是女神与高富帅之间的对话',
      picurl: 'http://nodeapi.cloudfoundry.com/qrcode.jpg',
      url: 'http://nodeapi.cloudfoundry.com/'
    }];
  }
}));

app.listen(80);