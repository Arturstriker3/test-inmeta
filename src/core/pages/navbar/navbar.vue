<script setup lang="ts">

import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { userAuthStore } from '../../stores/auth';
import { interfacePages } from '../../interface/interface';

const router = useRouter();
const userAuth = userAuthStore();

const navigateTo = (path: string) => {
  router.push(path);
};

const filteredPages = computed(() => {
  return interfacePages.filter(page => page.showWhenAuth === userAuth.GetIsAuth);
});

const projectName = ref('Vueduelist');

</script>

<template>
    <div className="w-screen h-screen overflow-hidden">
      <div className='w-screen py-6 px-5 lg:px-16 bg-[#154EC1] flex justify-between text-white'>
        <span className='text-lg font-semibold'>
          {{ projectName }}
        </span>
        
        <ul className='hidden md:flex items-center space-x-5'>        
            <li v-for="page in filteredPages" :key="page.path" @click="navigateTo(page.path)">
                <VaButton>
                    {{ page.name }}
                </VaButton>
            </li>
        </ul>

        <button className='space-y-1 group md:hidden'>
          <div className='w-6 h-1 bg-white'></div>
          <div className='w-6 h-1 bg-white'></div>
          <div className='w-6 h-1 bg-white'></div>

          <ul className='bg-[#154EC1] w-screen h-screen pb-10 absolute -top-full group-focus:top-0 right-0 duration-500 flex flex-col space-y-3 justify-start font-semibold'>
            <button className='px-10 py-8 relative ml-auto'>
              <div className='w-6 h-1 rotate-45 absolute bg-white'></div>
              <div className='w-6 h-1 -rotate-45 absolute bg-white'></div>
            </button>
            <li v-for="page in filteredPages" :key="page.path" className='flex justify-center w-full py-4 hover:bg-slate-300' @click="navigateTo(page.path)">
                {{ page.name }}
            </li>
          </ul>
        </button>
      </div>
    </div>
</template>