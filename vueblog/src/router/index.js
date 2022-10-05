import Vue from 'vue'
import store from '@/store'
import VueRouter from 'vue-router'
import PageHome from '../views/PageHome.vue'
import ArticleList from '../views/ArticleList.vue'
import PageArticle from '../views/PageArticle'
/* import PageEditor from '../views/PageEditor' */
import PageColumn from '../views/PageColumn'
import PageUser from '../views/PageUser'
import PageSocket from '../views/PageSocket'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import MHome from '../mviews/MHome'
import MArticleList from '../mviews/ArticleList'
import MArticle from '../mviews/MArticle'
import MUser from '../mviews/MUser'
import MColumn from '../mviews/MColumn'
const PageEditor = ()=> import(/* webpackChunkName:"PageEditor" */ '../views/PageEditor')
Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push
VueRouter.prototype.replace = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
const routes = [
  {
    path: '/',
    name: 'PageHome',
    redirect:'/index',
    component:PageHome,
    children:[
      {
        path:'/index',
        name:'index',
        component:ArticleList,
        props: (route) => ({
          columnId: route.query.columnId,
          searchVal: route.query.searchVal
        })
      },
      {
        path: '/article/:id',
        name: 'article',
        component: PageArticle
      },
      {
        path: '/editor',
        name: 'editor',
        component: PageEditor,
        props: (route) => ({
          columnId: route.query.columnId
        })
      },
      {
        path: '/column',
        name: 'column',
        component: PageColumn,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/user',
        name: 'user',
        component: PageUser,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/socket',
        name: 'socket',
        component: PageSocket
      },
    ]
  },
  {
    path: '/m',
    name: 'mHome',
    redirect: '/m/articles',
    component: MHome,
    children: [
      {
        path: 'articles',
        name: 'mArticleList',
        component: MArticleList,
        meta: {
          headType: 'SearchBar'
        }
      },
      {
        path: 'article/:id',
        name: 'mArticle',
        component: MArticle,
        meta: {
          headType: 'NavBar',
          title: '文章',
          button: '评论',
          buttonHandler: 'show-comment-action'
        }
      },
      {
        path: 'user',
        name: 'mUser',
        component: MUser,
        meta: {
          headType: 'NavBar',
          title: '我的'
        },
        props: (route) => ({
          state: route.query.state
        })
      },
      {
        path: 'column',
        name: 'mColumn',
        component: MColumn,
        meta: {
          headType: 'NavBar',
          title: '分类'
        }
      }
    ]
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  NProgress.start()
  let useAuth = to.meta.requiresAuth
  if (useAuth && !store.state.token) {
    Vue.prototype.$message.warning({
      message: `请先登录`
    })
    NProgress.done()
    next('/index')
    return 
  }
  next()
})

router.afterEach(() => {
  NProgress.done()
})
export default router
