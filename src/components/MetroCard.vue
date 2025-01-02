<template>
    <div class="bg-white shadow rounded p-4">
      <h2 class="text-lg font-semibold mb-2 text-center">Metro numéro {{ metro.numero }}</h2>
      <p class="text-gray-700">Marque : {{ metro.marque }}</p>
      <p class="text-gray-700">Modèle : {{ metro.modele }}</p>
      <p class="text-gray-700">Ligne : {{ metro.idligne === '1001' ? 'Ligne A' : metro.idligne === '1002' ? 'Ligne B' : metro.idligne  }}</p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps } from 'vue';
import type { Metro } from '../types';
  
  // Définir les propriétés que le composant attend
  const props = defineProps({
    metro: {
      type: Object as () => Metro,
      required: true,
    },
  });
  </script>
  