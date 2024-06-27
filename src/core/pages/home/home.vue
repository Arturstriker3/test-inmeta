<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { userAuthStore } from '../../stores/auth';
import TradeService from "../../services/trade";
import { createToaster } from "@meforma/vue-toaster";
import dateUtils from '@/core/utils/date.utils';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-cards';
import 'swiper/css/pagination';

const isLoading = ref(false);

const toaster = createToaster();

const userAuth = userAuthStore();

const userName = ref('');
const getUserName = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        const user = JSON.parse(storedUser);
        userName.value = user.name;
    }
}

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

onMounted(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    getUserName();
    getTrades();
});

const getOfferingCards = (trade: any) => {
    return trade.tradeCards.filter((card: Card) => card.type === 'OFFERING');
}

const getReceivingCards = (trade: any) => {
    return trade.tradeCards.filter((card: Card) => card.type === 'RECEIVING');
}

</script>

<template>
    <div class="flex flex-col w-screen h-screen px-10 py-4 gap-10" >
        <div class="flex justify-center items-center" >
            <VaCard class="mt-4 px-6 py-4 rounded-lg w-screen mx-auto" >
                <div v-if="userAuth.GetIsAuth" class="mb-4" >
                    <p class="text-left text-lg font-semibold" >Olá, {{ userName }} </p>
                    <VaDivider />
                </div>
                <div v-else >
                    <div class="flex flex-col items-center justify-center" >
                        <p class="text-center text-lg font-semibold" >Trocas Abertas</p>
                    </div>
                    <div class="mb-6">
                        <VaDivider />
                    </div>
                </div>
                <div v-if="isLoading" class="flex justify-center items-center">
                  <VaProgressCircle indeterminate
                  size="15rem"
                  />
                </div>
                <div v-else>
                    <VaCard class="mt-4 px-6 py-4 rounded-lg w-full mx-auto" >
                        <section id="Projects"
                            class="w-fit mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center justify-center gap-y-16 gap-x-14 mb-10">
                                <div v-for="trade in allTrades" :key="trade.id" class="w-72 bg-slate-50 shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl border border-gray-300">
                                <div class="text-center py-2">
                                    <p class="text-lg font-bold text-black truncate block capitalize">{{ trade.user.name }}</p>
                                </div>

                                <div class="flex gap-4">
                                    <swiper :pagination="{ dynamicBullets: true, type: 'progressbar', }" :navigation="true" :parallax="true" :effect="'cards'" :grabCursor="true" :rewind="true"  class="h-full w-full">
                                        <swiper-slide v-for="card in trade.tradeCards" :key="card.id" >
                                            <VaImage
                                                fit="contain"
                                                class="h-80 w-72 object-cover rounded-t-xl "
                                                :src="card.card.imageUrl || ''"
                                                lazy
                                                @loaded="trade.loaded = true"
                                                >
                                                <template #loader>
                                                    <VaProgressCircle indeterminate />
                                                </template>
                                            </VaImage>
                                        </swiper-slide>
                                    </swiper>
                                </div>
                                
                                <div class="px-4 py-3 w-72">
                                    <div class="min-h-36" >
                                        <p class="text-xs text-center font-semibold text-black cursor-auto my-3">Oferece:</p>
                                        <div class="text-center" >
                                            <template v-if="getOfferingCards(trade).length > 1">
                                                <swiper :pagination="{ dynamicBullets: true, type: 'progressbar' }" :navigation="true" :parallax="true" :effect="'cards'" :grabCursor="true" :loop="true" class="h-full w-full">
                                                    <swiper-slide v-for="card in getOfferingCards(trade)" :key="card.id">
                                                        <span class="text-gray-400 uppercase text-xs">{{ card.card.name }}</span>
                                                    </swiper-slide>
                                                </swiper>
                                            </template>
                                            <template v-else-if="getOfferingCards(trade).length === 1">
                                                <span class="text-gray-400 uppercase text-xs">{{ getOfferingCards(trade)[0].card.name }}</span>
                                            </template>
                                        </div>

                                        <p class="text-xs text-center font-semibold text-black cursor-auto my-3">Recebe:</p>
                                        <div class="text-center" >
                                            <template v-if="getReceivingCards(trade).length > 1">
                                                <swiper :pagination="{ dynamicBullets: true, type: 'progressbar' }" :navigation="true" :parallax="true" :effect="'cards'" :grabCursor="true" :loop="true" class="h-full w-full">
                                                    <swiper-slide v-for="card in getReceivingCards(trade)" :key="card.id">
                                                        <span class="text-gray-400 uppercase text-xs">{{ card.card.name }}</span>
                                                    </swiper-slide>
                                                </swiper>
                                            </template>
                                            <template v-else-if="getReceivingCards(trade).length === 1">
                                                <span class="text-gray-400 uppercase text-xs">{{ getReceivingCards(trade)[0].card.name }}</span>
                                            </template>
                                        </div>
                                    </div>
                                    
                                    <div class="flex justify-between items-center ">
                                        <p class="text-xs font-semibold text-black cursor-auto my-3">{{ dateUtils.formatDateTime(trade.createdAt) }}</p>

                                        <VaBadge
                                            overlap
                                        >
                                            <template #text>
                                                {{ trade.tradeCards.length }}
                                            </template>
                                        </VaBadge>
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

<style scoped>

</style>