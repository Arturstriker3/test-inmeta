<script setup lang="ts">
import { ref } from 'vue';
import { useForm } from 'vuestic-ui';
import { useRouter } from 'vue-router';
import { useAlertStore } from "../../stores/alert";
import autenticationService from "../../services/autentication";

const alertContext = useAlertStore();
const isLoading = ref(false);

const { isValid, validate, reset, resetValidation } = useForm('formRef')
const router = useRouter();
const form = ref({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
})

const goToHome = () => {
  router.push('/');
};

const submit = () => {
  isLoading.value = true;
  autenticationService.register({ name: form.value.name, email: form.value.email, password: form.value.password})
    .then(() => {
        alertContext.openAlert({ message: "Nova conta cadastrada com sucesso!", severity: "success", time: 3000 });
    })
    .finally(() => isLoading.value = false);
}

const handlePrint = () => {
  alertContext.openAlert({ message: "Testado com sucesso!", severity: "success", time: 3000 });
}

</script>

<template>
  <div class="flex items-center justify-center min-h-screen" >
    <VaCard class="p-4 rounded-lg w-full max-w-sm mx-auto" >
      <div class="flex flex-col items-center justify-center" >
        <p class="text-center text-lg font-semibold" >Registro</p>
      </div>
      <div class="mb-6">
        <VaDivider />
      </div>
      <VaForm ref="formRef" class="flex flex-col w- gap-2">
          <VaInput
              v-model="form.name"
              :rules="[(value) => (value && value.length > 0) || 'Digite o seu nome!']"
              label="Nome"
          />

          <VaInput
              v-model="form.email"
              :rules="[(value) => (value && value.length > 0) || 'Digite o seu email!']"
              label="Email"
          />

          <VaInput
              v-model="form.password"
              :rules="[(value) => (value && value.length > 0) || 'Digite a sua senha!']"
              label="Senha"
          />

          <VaInput
              v-model="form.confirmPassword"
              :rules="[(value) => (value === form.password) || 'Confirme a sua senha!']"
              label="Confirmar Senha"
              :disabled="form.password.length === 0"
          />

          <div class="flex flex-row justify-between">
            <VaButton preset="primary" @click="handlePrint()" class="w-28" >
            Print
            </VaButton>

            <VaButton preset="primary" @click="goToHome()" class="w-28" >
            Sair
            </VaButton>

            <VaButton :disabled="!isValid" @click="validate() && submit()" class="w-28">
            Registrar
            </VaButton>
          </div>
          
      </VaForm>
    </VaCard>
  </div>
</template>