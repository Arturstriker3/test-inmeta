<script setup lang="ts">
import { ref } from 'vue';
import { useForm } from 'vuestic-ui';
import { useRouter } from 'vue-router';
import { createToaster } from "@meforma/vue-toaster";
import EmailUtils from '../../utils/email.utils';

const toaster = createToaster();

const { isValid, validate, reset, resetValidation } = useForm('formRef')
const router = useRouter();
const form = ref({
    email: '',
    password: '',
})

const goToHome = () => {
  router.push('/');
};

const submit = () => alert('Form submitted!')

const validateEmail = (value: string) => {
  if (value.length === 0) return 'Digite o seu email!';
  if (!EmailUtils.isValid(value)) return 'Email inválido!';
  return true;
}

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
                :rules="[validateEmail]"
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