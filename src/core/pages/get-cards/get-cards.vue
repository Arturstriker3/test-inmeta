<script setup lang="ts">
import { useForm } from 'vuestic-ui';
import { ref, onMounted, watch } from 'vue';
import CardsService from "../../services/cards";
import { createToaster } from "@meforma/vue-toaster";
import dateUtils from '@/core/utils/date.utils';

const toaster = createToaster();

const isLoading = ref(false);

const { isValid, validate, reset, resetValidation } = useForm('formRef')
const maxLengthToInputs = 100
type FormField = 'cardText';

const form = ref({
    cardText: '',
})

type Card = {
    id: number;
    name: string;
    description: string;
    imageUrl?: string;
    createdAt: string;
};

const cardsToShow = ref<Card[]>([]);

const moreContent = ref(false);

watch(form, () => {
  (Object.keys(form.value) as FormField[]).forEach((field) => {
    truncateInput(field);
  });
});

const truncateInput = (field: FormField) => {
  if (form.value[field].length > maxLengthToInputs) {
    form.value[field] = form.value[field].substring(0, maxLengthToInputs);
  }
};

const validateLength = (value: string) => {
  return value.length <= maxLengthToInputs || '';
}

const getData = () => {
  isLoading.value = true;
  CardsService.getAvailableCards({})
    .then((response) => {
      cardsToShow.value = response.data.list;
      moreContent.value = response.data.more;
    })
    .catch(() => {
        reset()
        toaster.error('Falha ao carregar os cards.');
    })
    .finally(() => {isLoading.value = false});
}

onMounted(() => {
  getData()
});

</script>

<template>
    <div class="flex flex-col w-screen h-screen p-4 gap-10" >
        <div class="flex justify-center items-center" >
            <VaCard class="p-4 rounded-lg w-full mx-auto" >
              <div class="flex flex-col items-center justify-center" >
                <p class="text-center text-lg font-semibold" >Adquirir Cartas</p>
              </div>
              <div class="mb-6">
                <VaDivider />
              </div>
              <VaForm ref="formRef" class="flex flex-col w- gap-2">
        
                  <VaInput
                      v-model="form.cardText"
                      :rules="[validateLength]"
                      label="Pesquisar"
                      :disabled="isLoading"
                      :max-length="100"
                      counter
                      @input="truncateInput('cardText')"
                  />
        
                  <div class="flex flex-row justify-between">
                    <VaButton :disabled="isLoading" preset="primary" class="w-28" >
                    Sair
                    </VaButton>
        
                    <VaButton :disabled="!isValid || isLoading" class="w-28">
                      <div>
                        <VaIcon v-if="isLoading" class="" name="refresh" spin />
                        <p v-else >Entrar</p>
                      </div>
                    </VaButton>
                  </div>
              </VaForm>
            </VaCard>
        </div>
        <div v-if="isLoading" class="flex justify-center items-center">
          <VaProgressCircle indeterminate
          size="15rem"
          />
        </div>
        
        <div v-else>
          <div class="grid grid-cols-3 gap-4 overflow-auto">
            <div v-for="card in cardsToShow" :key="card.id" class="bg-white rounded-lg shadow-md p-4">
              <p class="text-lg font-semibold">{{ card.name }}</p>
              <p>{{ card.description }}</p>
              <img v-if="card.imageUrl" :src="card.imageUrl" alt="Card Image" class="my-2 rounded-lg">
              <p class="text-gray-500">{{ dateUtils.formatDateTime(card.createdAt) }}</p>
            </div>
          </div>
        </div>
    </div>
</template>
