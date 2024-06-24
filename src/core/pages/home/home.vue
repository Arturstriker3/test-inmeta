<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { userAuthStore } from '../../stores/auth';
import TradeService from "../../services/trade";
import { createToaster } from "@meforma/vue-toaster";
import { useToast, VaCard, VaIcon } from 'vuestic-ui'
import dateUtils from '@/core/utils/date.utils';

const isLoading = ref(false);

const toaster = createToaster();
const { notify } = useToast()

const userAuth = userAuthStore();

const allTrades = ref<any[]>([]);

type Card = {
    id: string;
    name: string;
    description: string;
    imageUrl?: string;
    createdAt: string;
    type: string;
};

const getTrades = () => {
  isLoading.value = true;
    TradeService.displayAllTrades()
    .then((response) => {
        allTrades.value = response.data.list;
    })
    .catch(() => {
        toaster.error('Falha ao carregar as solicitações de troca!');
    })
    .finally(() => {isLoading.value = false});
}

import image1 from '../../../assets/img/carrousel1.webp';
import image3 from '../../../assets/img/carrousel3.webp';
import image2 from '../../../assets/img/carrousel2.webp';
const carrouselItems =  [image1, image2, image3];

onMounted(() => {
    getTrades();
});

</script>

<template>
    <div class="flex flex-col w-screen h-screen px-10 py-4 gap-10" >
        <div class="flex justify-center items-center" >
            <VaCard class="mt-4 px-6 py-4 rounded-lg w-screen mx-auto" >
                <div v-if="isLoading" class="flex justify-center items-center">
                  <VaProgressCircle indeterminate
                  size="15rem"
                  />
                </div>
                <div v-else>
                    <div >
                        <div class="mb-6"  >
                            <VaCard>
                                <VaCarousel
                                :stateful="true"
                                :items="carrouselItems"
                                infinite
                                indicators
                                indicator-trigger="hover"
                                autoscroll
                                :autoscroll-interval="9000"
                                effect="fade"
                                swipable
                                :arrows="false"
                                loading="eager"
                                :draggable="false"
                                fadeKeyframe="va-carousel-fade-appear 1s"
                                fit="none"
                                class="p-3 rounded-lg"
                                >
                                <template #default="{ item }">
                                    <img :src="item" class="carousel-image" />
                                </template>
                                </VaCarousel>
                            </VaCard>
                        </div>

                        <div class="flex flex-col items-center justify-center" >
                            <p class="text-center text-lg font-semibold" >Solicitações de Troca</p>
                        </div>

                        <div class="mb-6">
                            <VaDivider />
                        </div>

                        <VaCard  >
                          <div class="relative overflow-x-auto">
                            <table class="w-full text-sm text-center table-auto rtl:text-center text-gray-500 dark:text-gray-400">
                                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" class="px-6 py-3">
                                            Usuário
                                        </th>
                                        <th scope="col" class="px-6 py-3">
                                            Horário
                                        </th>
                                        <th scope="col" class="px-6 py-3">
                                            Enviar
                                        </th>
                                        <th scope="col" class="px-6 py-3">
                                            Receber
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="trade in allTrades" :key="trade.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                          {{ trade.user.name }}
                                        </th>
                                        <td class="px-6 py-4">
                                          {{ dateUtils.formatDateTime(trade.createdAt) }}
                                        </td>
                                        <td class="px-6 py-4">
                                          <ul>
                                              <li v-for="card in trade.tradeCards.filter((card: Card) => card.type === 'OFFERING')" :key="card.id">
                                                  {{ card.card.name }}
                                              </li>
                                          </ul>
                                        </td>
                                        <td class="px-6 py-4">
                                          <ul>
                                            <li v-for="card in trade.tradeCards.filter((card: Card) => card.type === 'RECEIVING')" :key="card.id">
                                              {{ card.card.name }}
                                            </li>
                                          </ul>
                                        </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </VaCard>
                        
                    </div>
                </div>
            </VaCard>
        </div>
    </div>
</template>

<style scoped>
.carousel-image-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 20px;
}

.carousel-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  object-position: 100% 0
}
</style>