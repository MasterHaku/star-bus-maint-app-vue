<template>
    <div class="bg-white shadow rounded p-4">
      <h2 class="text-lg font-semibold mb-2 text-center">Bus numéro {{ bus.numero }}</h2>
      <p class="text-gray-700">Marque : {{ bus.marque }}</p>
      <p class="text-gray-700">Modèle : {{ bus.modele }}</p>
      <p class="text-gray-700">Dépôt : {{ bus.codedepot }}</p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps } from 'vue';
import type { Bus } from '../types';
  

  const props = defineProps({
    bus: {
      type: Object as () => Bus,
      required: true,
    },
  });
  </script>
  

  