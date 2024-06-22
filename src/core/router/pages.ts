import Login from "@/core/pages/login/login.vue";
import Register from "@/core/pages/register/register.vue"
import Home from "@/core/pages/home/home.vue"

import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(),
    routes: [
    { path: "/login", component: Login },
    { path: "/register", component: Register },
    { path: "/", component: Home },
]
});

export default router;