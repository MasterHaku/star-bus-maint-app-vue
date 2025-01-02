<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
        <div class="text-center">
            <h1 class="text-4xl font-bold mb-4">Soon</h1>
            <button @click="goBack" class="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Retour
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    const goBack = () => {
      window.history.back();  // Retourner à la page précédente
    };

    return { goBack };
  }
});
</script>

<style scoped>
/* Vous pouvez personnaliser ici si nécessaire */
</style>