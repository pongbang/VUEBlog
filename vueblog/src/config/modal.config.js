
export default {
  "login": {
    title: '登录',
    formType: 'login',
    //needUpdate: false,
    btns: [
      {
        targetName: 'close',
        name: '取消'
      },
      {
        targetName: 'confirm',
        name: '提交',
      }
    ]
  },
  "column": {
    title: '添加分类',
    formType: 'postColumn',
    needUpdate: true,
    btns: [
      {
        targetName: 'close',
        name: '取消'
      },
      {
        targetName: 'confirm',
        name: '提交',
      }
    ]
  },
  "register": {
    title: '注册',
    formType: 'register',
    btns: [
      {
        targetName: 'close',
        name: '取消'
      },
      {
        targetName: 'confirm',
        name: '注册',
      }
    ]
  },
  "userInfo": {
    title: '个人信息',
    formType: 'userInfo',
    btns: [
      {
        targetName: 'close',
        name: '取消'
      },
      {
        targetName: 'confirm',
        name: '提交',
      }
    ]
  }
}