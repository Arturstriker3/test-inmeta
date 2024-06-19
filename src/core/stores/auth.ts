import { defineStore } from "pinia";
import router from '../router/pages';

export const useAuthStore = defineStore("auth", {
    state: () => ({
        isAuth: false,
        returnUrl: null
    }),
    getters: {
        GetIsAuth: (state) => state.isAuth
    },
    actions: {
        login() {
            this.$state.isAuth = true;
            router.push(this.returnUrl || '/');
        },
        logout() {
            this.$state.isAuth = false;
            router.push('/login');
        }
    }
})