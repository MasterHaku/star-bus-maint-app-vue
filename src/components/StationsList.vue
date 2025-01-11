<template>
  <div class="flex flex-col items-center justify-center py-5 ">
    <div class="text-center w-full max-w-md p-4 bg-gray-50 rounded-lg shadow-lg border-2 border-starblue">
      <h1 class="text-2xl font-bold mb-6 rounded-lg ">Liste des Stations et Equipements du Réseau de Transport STAR</h1>
      <div
        class="w-full inline-flex justify-center items-center p-4 bg-gray-100 border-2 border-starblue rounded-lg shadow-md">
        <div class="flex items-center justify-center space-x-6">
          <SwitchCustom :titles="['Stations de Métro', 'Stations de Vélos', 'Parc Relais']"
            @updateOption="handleOptionChange" />
        </div>
      </div>
    </div>

    <!-- Nombre de ressources trouvées dans une pastille flottante -->
    <div class="fixed bottom-4 right-4 bg-blue-500 text-white text-sm px-4 py-2 rounded-full shadow-lg z-10">
      <span>
        {{ isShowingSubStat ? filteredSubStat.length : filteredBikeStat.length }}
        {{ isShowingSubStat ? 'stations de métros' : 'stations de vélos' }} trouvées
      </span>
    </div>

    <!-- Bouton retour -->
    <div class="fixed bottom-4 left-4 bg-blue-500 text-white text-sm px-4 py-2 rounded-full shadow-lg z-10">
      <button @click="goBack">Retour en arrière</button>
    </div>

    <!-- Grille de cartes -->
    <div class="grid-container flex flex-col py-2 min-h-screen flex-grow">
      
      <div v-if="isShowingSubStat && filteredSubStat.length > 0" class="grid justify-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5 p-4">
        <SubStationCard v-for="subStat in filteredSubStat" :key="subStat.nom" :sub-stat="subStat" @click="showDetails(subStat)" />
      </div>

      <div v-if="!isShowingSubStat && filteredBikeStat.length > 0"
        class="grid justify-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5 p-4">
        <VeloStationCard v-for="bikeStat in filteredBikeStat" :key="bikeStat.nom" :bike-stat="bikeStat" />
      </div>

    </div>

    <SubStationDetail v-if="isModalVisible && isShowingSubStat" :subStat="selectedRessource" :isVisible="isModalVisible" @close="closeModal" />

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import UtilsApi from '../Utils/UtilsApi';
import type { BikeStat, SubStat } from '../types';
import SubStationCard from './SubStationCard.vue';
import SubStationDetail from './SubStationDetail.vue';
import VeloStationCard from './VeloStationCard.vue';
import SwitchCustom from './SwitchCustom.vue';
const subStat = ref<SubStat[]>([]);
const bike = ref<BikeStat[]>([]);

const filteredSubStat = ref<SubStat[]>([]);
const filteredBikeStat = ref<BikeStat[]>([]);
const selectedOption = ref<string>('');

const selectedRessource = ref<SubStat | BikeStat | null>(null);

const isShowingSubStat = ref(true);
const isModalVisible = ref(false);

onMounted(async () => {
  try {
    const allSubStat: SubStat[] = [];
    const dataSubStat = await UtilsApi.performRequest("tco-metro-stations-etat-tr/records", 0, 100);
    if (dataSubStat) {
      dataSubStat.forEach((stations: any) => {
        allSubStat.push(stations);
      });
    }
    subStat.value = allSubStat;
    filteredSubStat.value = subStat.value;
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API Stations de Métros :", error);
  }

  try {
    const allBikes: BikeStat[] = [];
    const dataBike = await UtilsApi.performRequest("vls-stations-etat-tr/records", 0, 100);
    if (dataBike) {
      dataBike.forEach((metro: any) => {
        allBikes.push(metro);
      });
    }
    bike.value = allBikes;
    filteredBikeStat.value = bike.value;
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API Velo :", error);
  }
});


const handleOptionChange = (option: string) => {
  selectedOption.value = option;
  // Met à jour les données filtrées en fonction de l'option sélectionnée
  if (option.includes('Métro')) {
    filteredSubStat.value = subStat.value;
    filteredBikeStat.value = [];
    isShowingSubStat.value = true;
    console.log("Métro")
  } else if (option.includes('Vélos')) {
    filteredBikeStat.value = bike.value;
    filteredSubStat.value = [];
    isShowingSubStat.value = false;
  } else if (option.includes("Relais")) {
    filteredBikeStat.value = bike.value;
    filteredSubStat.value = [];
    isShowingSubStat.value = false;
  }
};

const goBack = () => {
  window.history.back();
};

type Ressource = SubStat | null;
const showDetails = (ressource: Ressource) => {
  selectedRessource.value = ressource;
  isModalVisible.value = true;
};

const closeModal = () => {
  selectedRessource.value = null;
  isModalVisible.value = false;
};
</script>

<style>
.toggle-switch {
  width: 40px;
  height: 20px;
  background-color: #ddd;
  border-radius: 10px;
  position: relative;
  cursor: pointer;
  appearance: none;
  outline: none;
  transition: background-color 0.2s;
}

.toggle-switch:checked {
  background-color: #02b1ae;
}

.toggle-switch::before {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  background-color: white;
  border-radius: 50%;
  top: 1px;
  left: 1px;
  transition: transform 0.2s;
}

.toggle-switch:checked::before {
  transform: translateX(20px);
}
</style>
