<script setup lang="ts">

import { ref, onMounted, computed } from 'vue';
import TradeService from "../../services/trade";
import CardsService from "../../services/cards";
import { createToaster } from "@meforma/vue-toaster";
import { useToast } from 'vuestic-ui'

const toaster = createToaster();
const { notify } = useToast()

const isLoading = ref(false);
const isTrading = ref(false);

type CardSend = {
    id: string;
    name: string;
    description: string;
    imageUrl?: string;
    createdAt: string;
    loaded: boolean;
    type: "OFFERING";
};

type CardReceive = {
    id: string;
    name: string;
    description: string;
    imageUrl?: string;
    createdAt: string;
    loaded: boolean;
    type: "RECEIVING";
};

const userCards = ref<CardSend[]>([]);
const availableCards = ref<CardReceive[]>([]);
const userSelectedCardsToSend = ref<CardSend[]>([]);
const userSelectedCardsToReceive = ref<CardReceive[]>([]);

const getUserCards = () => {
  CardsService.getUserCards()
    .then((response) => {
        userCards.value = response.data
    })
    .catch(() => {
        toaster.error('Falha ao carregar os cards do usuário!');
    })
}

const getAvailableCards = () => {
  CardsService.getAvailableCards()
    .then((response) => {
        availableCards.value = response.data.list.filter((card: CardReceive) =>
        card.id && card.name && card.description && card.imageUrl !== null
        );
    })
    .catch(() => {
        toaster.error('Falha ao carregar os cards disponíveis!');
    })
    .finally(() => {isLoading.value = false});
}

const getCardsData = () => {
    isLoading.value = true;
    getUserCards();
    getAvailableCards();
}

onMounted(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    getCardsData()
});

const isConfirmDisabled = computed(() => {
  return userSelectedCardsToSend.value.length !== userSelectedCardsToReceive.value.length ||
    userSelectedCardsToSend.value.length === 0 || 
    userSelectedCardsToReceive.value.length === 0;
});

const confirmBorderStyle = computed(() => {
  if (userSelectedCardsToSend.value.length === userSelectedCardsToReceive.value.length &&
      userSelectedCardsToSend.value.length > 0 &&
      userSelectedCardsToReceive.value.length > 0) {
    return 'border: 2px solid green';
  } else if ((userSelectedCardsToSend.value.length > 0 || userSelectedCardsToReceive.value.length > 0) &&
             userSelectedCardsToSend.value.length !== userSelectedCardsToReceive.value.length) {
    return 'border: 2px solid red';
  } else {
    return 'border: 2px solid black';
  }
});

const resetData = () => {
    userCards.value = [];
    availableCards.value = [];
    userSelectedCardsToSend.value = [];
    userSelectedCardsToReceive.value = [];
    getCardsData();
}

const sendUserTrade = () => {
    if (!isConfirmDisabled.value && !isTrading.value) {
        isTrading.value = true;
        const sendCards = userSelectedCardsToSend.value;
        const receiveCards = userSelectedCardsToReceive.value;
        
        TradeService.requestTrade(sendCards, receiveCards)
        .then(() => {
            notify({
                message: 'Solicitação de troca realizada com sucesso!',
                position: 'top-left',
                color: 'success',
            });
            resetData();
        })
        .catch(() => {
            toaster.error('Falha ao criar a solicitação de troca!');
        })
        .finally(() => {
            isTrading.value = false;
        });
    }
}

</script>

<template>
    <div class="flex flex-col w-screen h-screen px-10 py-4 gap-10" >
        <div class="flex justify-center items-center" >
            <VaCard class="mt-4 px-6 py-4 rounded-lg w-screen mx-auto" >
              <div class="flex flex-col items-center justify-center" >
                <p class="text-center text-lg font-semibold" >Solicitação de Trocas</p>
              </div>
              <div class="mb-6">
                <VaDivider />
              </div>
                <div v-if="isLoading" class="flex justify-center items-center">
                <VaProgressCircle indeterminate
                size="15rem"
                />
                </div>
                <div v-else>
                    <section id="Projects"
                    class="w-fit mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center justify-center gap-y-16 gap-x-14 mb-10">
                        <div class="w-72 bg-slate-50 shadow-md rounded-xl border border-gray-300">
                            <div class="text-center py-2">
                                <p class="text-lg font-bold text-black truncate block capitalize">Minhas Cartas</p>
                            </div>
                            <div>
                                <div class="flex flex-col p-2">
                                    <label class="text-[#154EC1] text-xs font-semibold uppercase px-3 mb-3" >Selecione suas cartas</label>
                                    <div class="text-center" >
                                        <VaSelect
                                            class="text-sm font-bold text-center text-black truncate block"
                                            multiple
                                            searchable
                                            :max-visible-options="1"
                                            selected-top-shown
                                            highlight-matched-text
                                            :options="userCards"
                                            text-by="name"
                                            track-by="id"
                                            v-model="userSelectedCardsToSend"
                                            :disabled="isTrading"
                                        >
                                        </VaSelect>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="place-self-center" >
                            <p v-show="!isTrading" class="text-xs font-semibold text-center text-gray-400 truncate block">Confirmar</p>
                            <div
                                class="flex justify-center align-middle items-center w-72 h-fit bg-slate-50 shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl cursor-pointer"
                                :disabled="isConfirmDisabled"
                                :style="confirmBorderStyle"
                                @click="!isTrading && sendUserTrade()"
                            >
                                <div class="text-center py-2"> 
                                    <p class="text-lg font-bold text-black truncate block capitalize">
                                        <VaIcon v-if="!isTrading" name="sync" size="large"></VaIcon>
                                        <VaIcon v-if="isTrading" name="sync" size="large" spin="counter-clockwise"></VaIcon>
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="w-72 bg-slate-50 shadow-md rounded-xl border border-gray-300">
                            <div class="text-center py-2">
                                <p class="text-lg font-bold text-black truncate block capitalize">Novas Cartas</p>
                            </div>
                            <div>
                                <div class="flex flex-col p-2">
                                    <label class="text-[#154EC1] text-xs font-semibold uppercase px-3 mb-3" >Selecione novas cartas</label>
                                    <div class="text-center pb-4" >
                                        <VaSelect
                                            class="text-sm font-bold text-center text-black truncate block"
                                            multiple
                                            searchable
                                            :max-visible-options="1"
                                            selected-top-shown
                                            highlight-matched-text
                                            :options="availableCards"
                                            text-by="name"
                                            track-by="id"
                                            v-model="userSelectedCardsToReceive"
                                            :disabled="isTrading"
                                        >
                                        </VaSelect>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </VaCard>
        </div>
    </div>
</template>