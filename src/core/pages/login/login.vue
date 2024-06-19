<script setup lang="ts">
import { reactive } from 'vue';
import { useForm } from 'vuestic-ui';
import { useRouter } from 'vue-router';

const { isValid, validate, reset, resetValidation } = useForm('formRef')
const router = useRouter();
const form = reactive({
    email: '',
    password: '',
})

const goToHome = () => {
  router.push('/');
};

const submit = () => alert('Form submitted!')
</script>

<template>
    <div class="flex items-center justify-center min-h-screen" >
      <VaCard class="p-4 rounded-lg w-full max-w-sm mx-auto" >
        <div class="flex flex-col items-center justify-center" >
          <p class="text-center text-lg font-semibold" >Login</p>
        </div>
        <div class="mb-6">
          <VaDivider />
        </div>
        <VaForm ref="formRef" class="flex flex-col w- gap-2">
  
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
  
            <div class="flex flex-row justify-between">
              <VaButton preset="primary" @click="goToHome()" class="w-28" >
              Sair
              </VaButton>
  
              <VaButton :disabled="!isValid" @click="validate() && submit()" class="w-28">
              Acessar
              </VaButton>
            </div>
            
        </VaForm>
      </VaCard>
    </div>
  </template>