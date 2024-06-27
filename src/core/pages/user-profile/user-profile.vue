<script setup lang="ts">
import { ref, onMounted } from 'vue';
import TradeService from "../../services/trade";
import { createToaster } from "@meforma/vue-toaster";
import { useToast, VaCard, VaIcon } from 'vuestic-ui'
import dateUtils from '@/core/utils/date.utils';

const isLoading = ref(false);
const isDeleteTrade = ref(false);
const idRemoving = ref('');

const toaster = createToaster();
const { notify } = useToast()

type User = {
    id: string;
    name: string;
    email: string;
};

type Card = {
    id: string;
    name: string;
    description: string;
    imageUrl?: string;
    createdAt: string;
    type: string;
};

const userProfile = ref<User | undefined>(undefined);
const userTrades = ref<any[]>([]);

const getUserData = () => {
    isLoading.value = true;
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        userProfile.value = JSON.parse(storedUser);
    } else {
        toaster.error('Falha ao carregar dados do usuário.');
    }
}

const getUserTrades = () => {
  isLoading.value = true;
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
      const userId = JSON.parse(storedUser).id;

      TradeService.displayAllTrades()
      .then((response) => {
          userTrades.value = response.data.list.filter((trade: any) => trade.userId === userId);
      })
      .catch(() => {
          toaster.error('Falha ao carregar as solicitações de troca!');
      })
      .finally(() => {isLoading.value = false});
  } 
}

const cancelTradeRequest = (idToDelete: string) => {
  idRemoving.value = idToDelete;
  isDeleteTrade.value = true;

  TradeService.deleteUserTrade(idToDelete)
    .then(() => {
      notify({
        message: 'Solicitação de troca removida com sucesso!',
        position: 'top-left',
        color: 'success',
      });
      getUserTrades();
    })
    .catch(() => {
      toaster.error('Falha ao deletar a solicitação de troca!');
    })
    .finally(() => {
      isDeleteTrade.value = false;
      idRemoving.value = '';
    });
}

const getUserInfoAndTrades = () => {
  getUserData();
  getUserTrades();
}

onMounted(() => {
    isLoading.value = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    getUserInfoAndTrades();
});

</script>

<template>
    <div class="flex flex-col w-screen h-screen px-10 py-4 gap-10" >
        <div class="flex justify-center items-center" >
            <VaCard class="mt-4 px-6 py-4 rounded-lg w-full mx-auto" >
              <div class="flex flex-col items-center justify-center" >
                <p class="text-center text-lg font-semibold" >Minha Conta</p>
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
                    <div >
                      <div class="flex flex-col gap-10 justify-center items-center mb-6"  >
                        <VaCard>
                            <div class="p-5 border rounded text-center text-slate-500 max-w-sm">
                              
                              <VaAvatar
                                src="https://loremflickr.com/320/240/yugioh,card/all"
                                size="large"
                                class=""
                                fallback-icon="account_circle"
                              />
                              <div class="text-sm mt-5">
                                  <p class="font-medium leading-none text-black" >{{ userProfile?.name }}</p>
                                  <p>{{ userProfile?.email }}</p>
                              </div>
                            </div>
                          </VaCard>
                        </div>

                        <div class="flex flex-col items-center justify-center" >
                          <p class="text-center text-lg font-semibold" >Minhas Solicitações</p>
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
                                            id Troca
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
                                        <th scope="col" class="flex items-center justify-center px-6 py-3">
                                          <VaIcon
                                            :name="'block'"
                                            color="#ffffff"
                                            size="large"
                                          />
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="trade in userTrades" :key="trade.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                          {{ trade.id }}
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
                                        <td class="px-6 py-4">
                                          <VaButton :disabled="isDeleteTrade" preset="primary" color="#ffffff"  @click="cancelTradeRequest(trade.id)">
                                            <div>
                                              <VaIcon v-if="!isDeleteTrade || trade.id !== idRemoving" name="delete" color="danger" />
                                              <VaIcon v-if="isDeleteTrade && trade.id === idRemoving" color="warning" name="recycling" spin />
                                            </div>
                                          </VaButton>
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