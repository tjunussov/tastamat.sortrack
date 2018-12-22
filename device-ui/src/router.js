import Vue from 'vue'
import Router from 'vue-router'
import Console from '@/components/Console'
import Console2 from '@/components/Console2'
import Admin from '@/components/Admin'
import Settings from '@/components/Settings'
import Debug from '@/components/Debug'
import Sortplan from '@/components/Sortplan'
import Users from '@/components/Users'


Vue.use(Router)

const router =  new Router({
  routes: [
    {
      path: '/console2',
      alias: '/',
      component: Console2,
      meta: { isPublic: true }
    },
    {
      path: '/console',
      component: Console
    },
    
    {
      path: '/admin',
      component: Admin,
      children: [
        {
          path: 'sortplan',
          alias: '',
          component: Sortplan
        },
        {
          path: 'settings',
          component: Settings
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