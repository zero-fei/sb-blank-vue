/*
  mockjs语法参考官网http://mockjs.com/
 */

const Mock = require('mockjs');
const svgCaptcha = require('svg-captcha');
const uuidV4 = require('uuid/v4');

const userLogin = '/api/login';
const userLogout = '/api/logout';
const userCaptcha = `/api/captcha`;
const checkCaptcha = `/api/checkCaptcha`;

// 用于存储验证码
const userCaptchaMapData = {};

// 60秒后验证码过期处理
setInterval(() => {
  const timestamp = new Date().getTime();
  const keys = Object.keys(userCaptchaMapData);
  keys.forEach((key) => {
    if (timestamp - userCaptchaMapData[key].timestamp > 1000 * 60) {
      delete userCaptchaMapData[key];
    }
  });
}, 1000 * 60);

const { mock } = Mock;
const loginData = mock({
  username: 'guest',
  enabled: true,
  accountNonExpired: true,
  credentialsNonExpired: true,
  accountNonLocked: true,
  loginUserDTO: {
    id: 'dd55bda7-df0d-4b77-99b2-7056717c6923',
    userAvatarPath: '/e39a5b790c354de1b7950e2bd42ec731.jpg',
    csrfToken: 'aabbcc22cc4ac5',
    userName: '游客'
  },
  authorities: [
    { url: ['/home'], typeCode: '1' },
    { url: ['/component/button'], typeCode: '1' },
    { url: ['/component/table'], typeCode: '1' },
    { url: ['/chart/analysis'], typeCode: '1' },
    { url: ['/chart/monitor'], typeCode: '1' }
  ]
});
module.exports = {
  [`POST ${userLogin}`](req, res) {
    res.json(loginData);
  },
  [`POST ${userLogout}`](req, res) {
    res.json({});
  },
  [`GET ${userLogin}`](req, res) {
    res.json(loginData);
  },
  [`GET ${userCaptcha}`](req, res) {
    let captcha = {};
    // 生成唯一标识;
    const key = uuidV4();
    const options = {
      height: 40,
      width: 100,
      noise: 4
    };
    if (req.query.type === 'math') {
      captcha = svgCaptcha.createMathExpr(options);
    } else {
      captcha = svgCaptcha.create(options);
    }
    userCaptchaMapData[key] = { text: captcha.text, timestamp: new Date().getTime() };
    res.json({ key, data: captcha.data });
  },
  [`POST ${checkCaptcha}`](req, res) {
    if (userCaptchaMapData[req.query.key] && userCaptchaMapData[req.query.key].text !== req.query.text) {
      res.json({ captchaResult: false });
    } else if (!userCaptchaMapData[req.query.key]) {
      res.json({ captchaResult: false, overdue: true });
    } else {
      res.json({ captchaResult: true });
    }
  }
};
