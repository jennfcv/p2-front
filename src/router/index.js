import { createRouter, createWebHistory } from 'vue-router'
import Grid from '@/views/Grid.vue'
import { useAuthStore } from '@/stores/auth'
import LoginView from '@/views/LoginView.vue'
import Dashboard from '@/views/Dashboard.vue'
import RegisterView from '@/views/RegisterView.vue'
import FlutterView from '@/views/FlutterView.vue'
import Socket from '@/views/Socket.vue'

const router = createRouter({
    history: createWebHistory(
        import.meta.env.BASE_URL),
    routes: [{
            path: '/login',
            name: 'login',
            component: LoginView,
        },
        {
            path: '/register',
            name: 'register',
            component: RegisterView,
        },
        {
            path: '/dashboard',
            component: Dashboard,
            meta: { requiresAuth: true },
            children: [

                {
                    path: '/',
                    redirect: '/dashboard'
                },
                {
                    path: '/about',
                    name: 'about',
                    component: () =>
                        import ('../views/AboutView.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/socket',
                    name: 'socket',
                    component: Socket,
                    meta: { requiresAuth: true }
                },
                {
                    path: '/flutter/:id/:codigo',
                    name: 'flutter',
                    component: FlutterView,
                },
                {
                    path: '/flutter-colaborativo/:codigo',
                    name: 'flutter-colaborativo',
                    component: FlutterView,
                },
                {
                    path: '/grid',
                    name: 'grid',
                    component: Grid,
                    meta: { requiresAuth: true }
                },
            ]
        },

    ],
})


router.beforeEach((to, from, next) => {
    const auth = useAuthStore()
    auth.init()

    if (to.meta.requiresAuth && !auth.isAuthenticated()) {
        next('/login')
    } else {
        next()
    }
})

export default router