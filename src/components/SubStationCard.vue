<template>
  <div class="bg-white shadow rounded p-4" :class="{
      'text-green-600 font-bold border border-green-600': subStat.etat === 'Ouverte',
      'text-red-600 font-bold border border-red-600': subStat.etat !== 'Ouverte'
  }">

    <h2 class="text-lg font-semibold mb-2 text-center">{{ subStat.nom }}</h2>

    <p class="text-gray-600 font-bold border border-gray-600 rounded px-2 py-1 mb-1">
      Ligne: {{ subStat.idligne === '1001' ? 'Ligne A' : subStat.idligne === '1002' ? 'Ligne B' : subStat.idligne }}
    </p>
    <p class="text-gray-600 font-bold border border-gray-600 rounded px-2 py-1 mb-1">
      ID: {{ subStat.idstation }}
    </p>
    <p class="text-gray-700 font-bold border px-2 py-1 rounded mb-1" :class="{
      'text-green-600 border-green-600': subStat.etat === 'Ouverte',
      'text-red-600 border-red-600': subStat.etat !== 'Ouverte'
    }">
      Etat: {{ subStat.etat }}
    </p>

  </div>
</template>


<script setup lang="ts">
import { defineProps } from 'vue';
import type { SubStat } from '../types';


defineProps({
  subStat: {
    type: Object as () => SubStat,
    required: true,
  },
});
</script>