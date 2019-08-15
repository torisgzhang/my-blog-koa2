const router = require('koa-router')();
const {
  getList,
  getDetail,
  addBlog,
  updateBlog,
  delBlog
}  = require('../controller/blog.js');
const loginCheck = require('../middleware/loginCheck');
const { SuccessModel, ErrorModel } = require('../model/resModel');

//前缀
router.prefix('/api/blog');

router.get('/list', async function (ctx, next) {
  let author = ctx.query.author || '';
  const keyword = ctx.query.keyword || '';
  if(ctx.query.isadmin) {
    if(ctx.session.username == null) {
      ctx.body = new ErrorModel('未登录');
      return;
    }
    author = ctx.session.username;
  }
  const listData = await getList(author, keyword);
  ctx.body = new SuccessModel(listData);
});

router.get('/detail', async function (ctx, next) {
  const id = ctx.query.id || '';
  const detailData = await getDetail(id);
  ctx.body = new SuccessModel(detailData);
});

router.post('/add', loginCheck, async function (ctx, next) {
  const body = ctx.request.body;
  body.author = ctx.session.username;
  const addResult = await addBlog(body);
  if(addResult) {
    ctx.body = new SuccessModel(addResult);
  } else {
    ctx.body = new ErrorModel("新建文章失败");
  }
});

router.post('/update', loginCheck, async function (ctx, next) {
  const body = ctx.request.body;
  body.author = ctx.session.username;
  const id = ctx.query.id || '';
  const updateResult = await updateBlog(id, body);
  if(updateResult) {
    ctx.body = new SuccessModel(updateResult);
  } else {
    ctx.body = new SuccessModel('修改文章失败');
  }
});

router.post('/del', loginCheck, async function (ctx, next) {
  const id = ctx.query.id || '';
  const delResult = await delBlog(id, ctx.session.username);
  if(delResult) {
    ctx.body = new SuccessModel(delResult);
  } else {
    ctx.body = new SuccessModel('删除文章失败');
  }
});

module.exports = router;