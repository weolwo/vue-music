import Vue from 'vue'
import Router from 'vue-router'
/*
一、为什么要使用路由懒加载
　　为给客户更好的客户体验，首屏组件加载速度更快一些，解决白屏问题。
二、定义
　　懒加载简单来说就是延迟加载或按需加载，即在需要的时候的时候进行加载。
三、使用
　　常用的懒加载方式有两种：即使用vue异步组件 和 ES中的import
*/
const Recommend = () => import('../components/recommend/recommend')
const Singer = () => import('../components/singer/singer')
const Rank = () => import('../components/rank/rank')
const Search = () => import('../components/search/search')
const SingerDetail = () => import('../components/singer-detail/singer-detail')
const Disc = () => import('../components/disc/disc')
const TopList = () => import('../components/top-list/top-list')
const UserHome = () => import('../components/user-home/user-home')
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/rank',
      component: Rank,
      children: [
        {
          path: ':id',
          component: TopList
        }
      ]
    },
    {
      path: '/search',
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/user',
      component: UserHome
    }
  ]
})
