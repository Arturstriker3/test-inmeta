<script setup lang="ts">
import { ref } from 'vue';
import { useForm } from 'vuestic-ui';
import { useRouter } from 'vue-router';
import autenticationService from "../../services/autentication";
import { createToaster } from "@meforma/vue-toaster";
import EmailUtils from '../../utils/email.utils';

const toaster = createToaster();

const isLoading = ref(false);
const isSubmited = ref(false)

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
        toaster.success(`Nova conta cadastrada com sucesso!`);
    })
    .catch(() => {
        resetValidation()
        reset()
    })
    .finally(() => {isLoading.value = false, isSubmited.value = true});
}

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
        <p class="text-center text-lg font-semibold" >Registro</p>
      </div>
      <div class="mb-6">
        <VaDivider />
      </div>
      <div>
        <div v-if="!isSubmited" >
          <VaForm ref="formRef" class="flex flex-col w- gap-2">
            <VaInput
                v-model="form.name"
                :rules="[(value) => (value && value.length > 0) || 'Digite o seu nome!']"
                label="Nome"
                :disabled="isLoading"
            />

            <VaInput
                v-model="form.email"
                :rules="[validateEmail]"
                label="Email"
                :disabled="isLoading"
            />

            <VaInput
                v-model="form.password"
                :rules="[(value) => (value && value.length > 0) || 'Digite a sua senha!']"
                label="Senha"
                :disabled="isLoading"
            />

            <VaInput
                v-model="form.confirmPassword"
                :rules="[(value) => (value === form.password) || 'Confirme a sua senha!']"
                label="Confirmar Senha"
                :disabled="form.password.length === 0 || isLoading"
            />

            <div class="flex flex-row justify-between">
              <VaButton :disabled="isLoading" preset="primary" @click="goToHome()" class="w-28" >
                <div>
                  <p :disabled="isLoading" >Sair</p>
                </div>
              </VaButton>

              <VaButton :disabled="!isValid || isLoading" @click="validate() && submit()" class="w-28">
                <div>
                  <VaIcon v-if="isLoading" class="" name="refresh" spin />
                  <p v-else >Registrar</p>
                </div>
              </VaButton>
            </div>
          </VaForm>
        </div>

        <div v-else class="flex flex-col gap-4">
          <div class="flex justify-center">
            <VaBadge class="font-" text="Sua conta foi registrada!" color="success"/>
          </div>
          <VaButton :disabled="isLoading" preset="primary" @click="goToHome()" class="w-28" >
            <div>
              <p :disabled="isLoading" >Sair</p>
            </div>
          </VaButton>
        </div>
      </div>
    </VaCard>
  </div>
</template>