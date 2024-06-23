<script setup lang="ts">

import { ref, computed, onMounted } from 'vue';
import { RouterView ,useRouter, useRoute } from 'vue-router';
import { userAuthStore } from '../../core/stores/auth';
import { interfacePages } from '../../core/interface/interface';

const router = useRouter();
const route = useRoute();
const userAuth = userAuthStore();

const navigateTo = (path: string) => {
  router.push(path);
};

const filteredPages = computed(() => {
  return interfacePages.filter(page => page.showWhenAuth === userAuth.GetIsAuth);
});

const shouldShowNavbar = computed(() => {
  const currentPage = interfacePages.find(page => page.path === route.path);
  return currentPage ? currentPage.showNavbar : false;
});

const handleLogout = () => {
  userAuth.logout();
};

onMounted(() => {
  userAuth.initializeFromLocalStorage()
});

const mobileMenuVisible = ref(false);
const toggleMobileMenu = () => {
  mobileMenuVisible.value = !mobileMenuVisible.value;
};

const projectName = ref('Vueduelist');

</script>

<template>
    <div class="w-screen h-screen ">
      <div v-if="shouldShowNavbar">
        <div class='w-screen py-6 px-5 lg:px-16 bg-[#154EC1] flex justify-between text-white items-center'>
          <span class='text-lg font-semibold'>
            {{ projectName }}
          </span>
          
          <ul class='hidden md:flex items-center space-x-5'>        
              <li v-for="page in filteredPages" :key="page.path" @click="navigateTo(page.path)">
                  <VaButton>
                      {{ page.name }}
                  </VaButton>
              </li>
              <li v-if="userAuth.GetIsAuth" >
                <VaButton @click="handleLogout">
                  <VaIcon
                    :name="'logout'"
                    color="#ffffff"
                    size="large"
                  />
                </VaButton>
              </li>
          </ul>

          <button class='space-y-1 group md:hidden z-50 overflow-hidden' @click="toggleMobileMenu">
            <div class='w-6 h-1 bg-white'></div>
            <div class='w-6 h-1 bg-white'></div>
            <div class='w-6 h-1 bg-white'></div>

            <ul class='bg-[#154EC1] w-screen h-screen pb-10 absolute -top-full group-focus:top-0 right-0 duration-500 flex flex-col space-y-3 justify-start font-semibold text-lg' v-show="mobileMenuVisible">
              <button ref="closeMenuButton" class='px-10 py-8 relative ml-auto' @click="toggleMobileMenu">
                <div class='w-6 h-1 rotate-45 absolute bg-white'></div>
                <div class='w-6 h-1 -rotate-45 absolute bg-white'></div>
              </button>
              <li v-for="page in filteredPages" :key="page.path" class='flex justify-center w-full py-4 hover:bg-slate-300' @click="() => { navigateTo(page.path);}">
                  {{ page.name }}
              </li>
              <li  v-if="userAuth.GetIsAuth" class='flex justify-center w-full py-4 hover:bg-slate-300' @click="handleLogout">
                <VaIcon
                    :name="'logout'"
                    color="#ffffff"
                    :size="30"
                  />
              </li>
            </ul>
          </button>
        </div>
      </div>
      <main class="w-screen z-0" >
        <RouterView />
      </main>
      
    </div>
</template>