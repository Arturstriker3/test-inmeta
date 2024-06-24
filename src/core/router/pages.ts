import Login from "@/core/pages/login/login.vue";
import Register from "@/core/pages/register/register.vue"
import Home from "@/core/pages/home/home.vue"
import GetCards from "@/core/pages/get-cards/get-cards.vue"
import CardExchange from "@/core/pages/card-exchange/card-exchange.vue"
import UserProfile from "@/core/pages/user-profile/user-profile.vue"
import pageNotFound from "@/core/pages/errors/404.vue"
import { userAuthStore } from '../stores/auth';
import { interfacePages } from '../interface/interface';

import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/login", component: Login },
        { path: "/register", component: Register },
        { path: "/", component: Home },
        { path: "/get-cards", component: GetCards },
        { path: "/card-exchange", component: CardExchange },
        { path: "/user-profile", component: UserProfile },
        { path: "/:pathMatch(.*)", component: pageNotFound },
    ]
});

router.beforeEach((to, _, next) => {
    const authStore = userAuthStore();
    const targetPage = interfacePages.find(page => page.path === to.path);

    if (targetPage && targetPage.showWhenAuth && !authStore.GetIsAuth) {
        next('/login');
    } else {
        next();
    }
});

export default router;