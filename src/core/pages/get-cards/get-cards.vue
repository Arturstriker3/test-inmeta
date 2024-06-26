<script setup lang="ts">
import { useForm } from 'vuestic-ui';
import { ref, onMounted, watch, computed } from 'vue';
import CardsService from "../../services/cards";
import { createToaster } from "@meforma/vue-toaster";
import dateUtils from '@/core/utils/date.utils';
import { useToast } from 'vuestic-ui'

const toaster = createToaster();
const { notify } = useToast()

const isLoading = ref(false);
const isBuyingCard = ref(false);

const { reset } = useForm('formRef')
const maxLengthToInputs = 100
type FormField = 'cardText';

const form = ref({
    cardText: '',
})

type Card = {
    id: string;
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

const buyTheCard = (cardId: string) => {
  isBuyingCard.value = true;
  CardsService.buyTheCard(cardId)
    .then(() => {
      notify({
      message: 'Carta adquirida com sucesso!',
      position: 'top-left',
      color: 'success',
      });
    })
    .catch(() => {
        reset()
        toaster.error('Falha ao adquirir o card!');
    })
    .finally(() => {isBuyingCard.value = false});
}

onMounted(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  getData()
});

const filteredCards = computed(() => {
  const searchText = form.value.cardText.toLowerCase();
  return cardsToShow.value.filter(card => 
    card.name.toLowerCase().includes(searchText) || 
    card.description.toLowerCase().includes(searchText)
  );
});

</script>

<template>
    <div class="flex flex-col w-screen h-screen px-10 py-4 gap-10" >
        <div class="flex justify-center items-center" >
            <VaCard class="mt-4 px-6 py-4 rounded-lg w-screen mx-auto" >
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
              </VaForm>

              <VaDivider />

              <div v-if="isLoading" class="flex justify-center items-center">
                <VaProgressCircle indeterminate
                size="15rem"
                />
              </div>
              
              <div v-else>
                <VaCard class="mt-4 px-6 py-4 rounded-lg w-full mx-auto" >
                  <section id="Projects"
                  class="w-fit mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4   justify-items-center justify-center gap-y-16 gap-x-14 mb-10">
                    <div v-for="card in filteredCards" :key="card.id" class="w-72 bg-slate-50 shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl border border-gray-300">
                      <div class="text-center py-2">
                        <p class="text-lg font-bold text-black truncate block capitalize">{{ card.name }}</p>
                      </div>

                      <div class="flex gap-4">
                        <VaImage
                          fit="contain"
                          class="h-80 w-72 object-cover rounded-t-xl "
                          :src="card.imageUrl"
                          lazy
                          @loaded="card.loaded = true"
                          >
                          <template #loader>
                            <VaProgressCircle indeterminate />
                          </template>
                        </VaImage>
                      </div>
                      
                      <div class="px-4 py-3 w-72">
                          <div class="min-h-36 text-justify" >
                            <span class="text-gray-400 mr-3 uppercase text-xs">{{card.description}}</span>
                          </div>
                          
                          <div class="flex items-center">
                              <p class="text-xs font-semibold text-black cursor-auto my-3">{{ dateUtils.formatDateTime(card.createdAt) }}</p>
                              <div class="ml-auto">
                                <VaButton
                                  round
                                  :disabled="!card.loaded || isBuyingCard"
                                  @click="() => buyTheCard(card.id)"
                                >
                                  <VaIcon
                                    :name="'add'"
                                    color="#ffffff"
                                    size="small"
                                  />
                                </VaButton>
                                
                              </div>
                          </div>
                      </div>
                    </div>
                  </section>
                </VaCard>
              </div>
            </VaCard>
        </div>
        
    </div>
</template>
