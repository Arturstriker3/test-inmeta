import { defineStore } from "pinia";
import router from '../router/pages';
import autenticationService from "../services/autentication";
import { createToaster } from "@meforma/vue-toaster";

const toaster = createToaster();

export const useAuthStore = defineStore("auth", {
    state: () => ({
        isAuth: false,
        returnUrl: null
    }),
    getters: {
        GetIsAuth: (state) => state.isAuth
    },
    actions: {
        login(emailInput: string, passwordInput: string) {
            autenticationService.login({email: emailInput, password: passwordInput})
                .then(() => {
                    toaster.success(`Nova conta cadastrada com sucesso!`);
                })
                .catch(() => {
                    
                })
                .finally(() => {
                    toaster.success(`Usuário #### logado com sucesso!`);
                    this.$state.isAuth = true;
                });

            // router.push(this.returnUrl || '/');
        },
        logout() {
            this.$state.isAuth = false;
            router.push('/login');
        }
    }
})