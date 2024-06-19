import { defineStore } from "pinia";

interface IAlertMessage {
    message: string;
    severity: "default" | "error" | "success";
    time: number
}

export const useAlertStore = defineStore("alert", {
    state: () => ({
        isActive: false,
        message: "",
        severity: null
    }),
    getters: {
        getIsActive: (state) => state.isActive,
        getMessage: (state) => state.message,
    },
    actions: {
        deactive() {
            this.$state.isActive = false;
        },
        active() {
            this.$state.isActive = true;
        },
        openAlert(body: IAlertMessage) {
            this.active();
            this.severity = body.severity;
            this.$state.message = body.message;
            setTimeout(() => {
                this.deactive();
            }, body.time);
        }
    }
})