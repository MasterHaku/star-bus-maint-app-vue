<template>
    <div v-if="isVisible" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg w-11/12 lg:w-2/3 xl:w-1/2 max-h-[90vh] overflow-y-auto relative">
        <!-- Titre de la station -->
        <h2 class="text-2xl font-bold mb-4 text-center">Station {{ subStat.nom }}</h2>
  
        <!-- Affichage des compteurs par type -->
        <div v-if="typeCounts" class="mb-4 flex space-x-4 justify-center">
          <div v-for="(count, type) in typeCounts" :key="type" class="border p-4 rounded-lg w-1/3 text-center">
            <p class="text-lg font-semibold">{{ type }}: {{ count.inService }}/{{ count.max }}</p>
          </div>
        </div>
  
        <!-- Détails des équipements si disponibles -->
        <div v-if="subStationDetail && subStationDetail.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div v-for="(detail, index) in subStationDetail" :key="index" class="mb-2 border p-4 rounded-lg">
            <p><strong>ID Equipement:</strong> {{ detail.idequipement }}</p>
            <p><strong>Nom:</strong> {{ detail.nom }}</p>
            <p><strong>Nom de la station:</strong> {{ detail.nomstation }}</p>
            <p><strong>Type:</strong> {{ detail.type }}</p>
            <p ><strong>ID Ligne:</strong> {{ detail.idligne === '1001' ? 'Ligne A' : detail.idligne === '1002' ? 'Ligne B' : detail.idligne }}</p>
            <p :class="{
              'text-green-600 font-bold border border-green-600 rounded px-2 py-1 inline-block': detail.etat[0] === 'En fonctionnement',
              'text-red-600 font-bold border border-red-600 rounded px-2 py-1 inline-block': detail.etat[0] !== 'En fonctionnement'
            }"><strong>Etat:</strong> {{ detail.etat[0] }}</p>
          </div>
        </div>
  
        <!-- Message si aucun détail n'est disponible -->
        <p v-else class="text-gray-500 text-center mt-4">
          Aucun appareils disponible pour cette station.
        </p>
  
        <!-- Bouton de fermeture flottant au bas de la modal -->
        <div class="mt-4 flex justify-end">
          <button @click="closeModal" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Fermer
          </button>
        </div>
      </div>
    </div>
  </template>



<script setup lang="ts">
import { defineProps, defineEmits, onMounted, ref, computed } from 'vue';
import type { SubStat, SubStatUtils } from '../types';
import UtilsApi from '../Utils/UtilsApi';

// Props définies
const props = defineProps({
    subStat: {
        type: Object as () => SubStat,
        required: true,
    },
    isVisible: {
        type: Boolean,
        required: true,
    },
});

const emit = defineEmits(['close']);
const subStationDetail = ref<SubStatUtils[] | null>(null);

// Méthode pour fermer la modal
const closeModal = () => {
    emit('close');
};

// Utilisation de subStation dans onMounted
onMounted(async () => {
    try {
        const allSubStatDet: SubStatUtils[] = [];
        const dataSubStatDet = await UtilsApi.performRequest("tco-metro-equipements-etat-tr/records",0,100,props.subStat.idstation,"idstation");


        if (dataSubStatDet) {
            dataSubStatDet.forEach((stations: any) => {
                allSubStatDet.push(stations);

            });
        }
        subStationDetail.value = allSubStatDet;

    } catch (error) {
        console.error("Erreur lors de l'appel à l'API Stations de Métros :", error);
    }
});


const typeCounts = computed(() => {
  if (!subStationDetail.value) return null;

  // Initialisation de l'objet de comptage
  const counts: Record<string, { max: number, inService: number }> = {};

  // On parcourt chaque détail pour calculer les counts
  subStationDetail.value.forEach((detail) => {
    const type = detail.type;
    
    if (!counts[type]) {
      counts[type] = { max: 0, inService: 0 };
    }

    counts[type].max++;  // Augmenter le nombre total de ce type
    if (detail.etat[0] === 'En fonctionnement') {
      counts[type].inService++;  // Augmenter le nombre en fonctionnement
    }
  });

  return counts;
});
</script>
?select=*&where=idstation%3D15001&limit=100