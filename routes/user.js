const router = require('koa-router')();
const {
  login
}  = require('../controller/user');
const loginCheck = require('../middleware/loginCheck');
const { SuccessModel, ErrorModel } = require('../model/resModel');

//前缀
router.prefix('/api/user');

router.post('/login', async function (ctx, next) {
  const { username, password } = ctx.request.body;
  const userInfo = await login(username, password);
  if(userInfo.username) {
    //操作cookie
    ctx.session.username = userInfo.username;
    ctx.session.realname = userInfo.realname;
    ctx.body = new SuccessModel(userInfo);
    return;
  }
  ctx.body = new ErrorModel('登录失败，请输入正确的用户名或密码');
});


module.exports = router;