<script setup lang="ts">
import { useForm } from 'vuestic-ui';
import { ref, onMounted, watch } from 'vue';
import CardsService from "../../services/cards";
import { createToaster } from "@meforma/vue-toaster";
import dateUtils from '@/core/utils/date.utils';

const toaster = createToaster();

const isLoading = ref(false);

const { isValid, reset } = useForm('formRef')
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
    loaded: boolean;
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
      cardsToShow.value = response.data.list.filter((card: Card) =>
        card.id && card.name && card.description && card.imageUrl !== null
      );
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
          <div class="grid grid-cols-5 gap-4 overflow-auto">
            <div v-for="card in cardsToShow" :key="card.id" class="grid grid-cols-1 gap-2 items-center bg-slate-100 rounded-lg shadow-md p-4">
              <p class="text-lg font-semibold">{{ card.name }}</p>
              <div v-if="!card.loaded">
                <VaProgressCircle indeterminate size="large" />
              </div>  
              <VaImage
                fit="cover"
                :src="card.imageUrl"
                lazy
                @loaded="card.loaded = true"
                class="rounded-lg va-image-custom"
              />
              <p>{{ card.description }}</p>
              <p class="text-gray-500">{{ dateUtils.formatDateTime(card.createdAt) }}</p>
            </div>
          </div>
        </div>
    </div>
</template>

<style scoped>
.va-image-custom {
  aspect-ratio: 223 / 310; /* Define a proporção desejada */
  max-width: 100%; /* Define a largura máxima */
  max-height: 310px; /* Define a altura máxima */
  width: auto; /* Permite que a largura seja ajustada automaticamente */
  height: auto; /* Permite que a altura seja ajustada automaticamente */
}
</style>
