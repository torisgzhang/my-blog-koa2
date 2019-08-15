const uuid = require('uuid/v1');
const xss = require('xss');
const { exec, escape } = require('../db/mysql');

const getList = async (author, keyword) => {
  let sql = `SELECT * from tg_blogs WHERE 1=1 `;
  if(author) {
    sql += `AND author='${author}' `;
  }
  if(keyword) {
    sql += `AND title like '%${keyword}%' `;
  }
  sql += `ORDER BY createtime desc`;
  return await exec(sql);
}

const getDetail = async (id) => {
  let sql = `SELECT * from tg_blogs WHERE articleid='${id}'`;
  const rows = await exec(sql);
  return rows[0];
}

const addBlog = async (postData = {}) => {
  const title = xss(postData.title);
  const content = xss(postData.content);
  let sql = `
    INSERT INTO tg_blogs (articleid, title, content, createtime, author) 
    VALUES('${uuid()}', ${escape(title)}, ${escape(content)}, ${Date.now()}, '${postData.author}')
  `;
  const addData = await exec(sql);
  if(addData.affectedRows > 0) {
    return true;
  } else {
    return false;
  }
}

const updateBlog = async (id, postData = {}) => {
  let sql = `
    UPDATE tg_blogs SET title=${escape(postData.title)}, content=${escape(postData.content)} WHERE articleid='${id}'
  `;
  const updateData = await exec(sql);
  if(updateData.affectedRows > 0) {
    return true;
  } else {
    return false;
  }
}

const delBlog = async (id, author) => {
  let sql = `
    DELETE from tg_blogs WHERE articleid='${id}' AND author='${author}'
  `;
  const delData = await exec(sql);
  if(delData.affectedRows > 0) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  getList,
  getDetail,
  addBlog,
  updateBlog,
  delBlog
}