<template>
    <div class="bg-white shadow rounded p-4" :class="{
        'text-green-600 font-bold border border-green-600 rounded px-2 py-1 inline-block': bikeStat.etat[0] === 'En fonctionnement',
        'text-red-600 font-bold border border-red-600 rounded px-2 py-1 inline-block': bikeStat.etat[0] !== 'En fonctionnement'
      }">


      <h2 class="text-lg font-semibold mb-2 text-center">{{ bikeStat.nom }}</h2>
      
      <p class="text-gray-700">Vélos disponibles: {{ bikeStat.nombrevelosdisponibles }}/{{ bikeStat.nombreemplacementsactuels }}</p>
      
      <p class="text-gray-700" :class="{
        'text-green-600 font-bold border border-green-600 rounded px-2 py-1 inline-block': bikeStat.etat[0] === 'En fonctionnement',
        'text-red-600 font-bold border border-red-600 rounded px-2 py-1 inline-block': bikeStat.etat[0] !== 'En fonctionnement'
      }">Etat: {{ bikeStat.etat[0] }}</p>
      
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps } from 'vue';
import type { BikeStat } from '../types';
  

defineProps({
    bikeStat: {
      type: Object as () => BikeStat,
      required: true,
    },
  });
  </script>