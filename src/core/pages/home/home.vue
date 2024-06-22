<script setup lang="ts">
import { userAuthStore } from '../../stores/auth';

const userAuth = userAuthStore();

</script>

<template>
    <div>
        <h1>Home Page</h1>
        <VaButton> Button </VaButton>
        {{ userAuth.GetIsAuth }}
    </div>
</template>