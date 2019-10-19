import Vue from 'vue'
import Router from 'vue-router'
// import Console from '@/components/Console'
import Console from '@/components/Console'
import Admin from '@/components/Admin'
import Settings from '@/components/Settings'
import Debug from '@/components/Debug'
import Sortplan from '@/components/Sortplan'
import Users from '@/components/Users'


Vue.use(Router)

const router =  new Router({
  routes: [
    {
      path: '/console',
      alias: '/',
      component: Console,
      meta: { isPublic: true }
    },
    // {
    //   path: '/console',
    //   component: Console
    // },
    
    {
      path: '/admin',
      component: Admin,
      children: [
        {
          path: 'settings',
          alias: '',
          component: Settings
        },
        {
          path: 'sortplan',
          component: Sortplan
        },
        {
          path: 'users',
          component: Users
        },
        
        {
          path: 'debug',
          component: Debug
        }
      ]
    },
    // { path: '*', redirect: '/console' }
  ],
  linkActiveClass : 'active',
  onError(e){
    console.error('Router Error',e);
  }
})
/*
// Auth Handling
router.beforeEach((to, from, next) => {
  
  if (to.matched.every(record => record.meta.isPublic)) {
    next() // make sure to always call next()!
  } else {
    // this route requires auth, check if logged in
    // if not, redirect to login page or Login Modal
    checkLoggedIn(this.a.app).then(ok=>{
      ok ? next() : next({path: '/login',query: {redirect:to.fullPath}})
      // ok ? next() : next('/login')      
    }).catch(error=>{
      console.error('route error',error);
      next(error)
    })
  }
})*/


export default router;