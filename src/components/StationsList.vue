<template>
  <div class="flex flex-col items-center justify-center py-5 ">
    <div class="text-center w-full max-w-md p-4 bg-gray-50 rounded-lg shadow-lg border-2 border-starblue">
      <h1 class="text-2xl font-bold mb-6 rounded-lg ">Liste des Stations et Equipements du Réseau de Transport STAR</h1>
      <div
        class="w-full inline-flex justify-center items-center p-4 bg-gray-100 border-2 border-starblue rounded-lg shadow-md">
        <div class="flex items-center justify-center space-x-6">
          <SwitchCustom :titles="['Stations de Métro', 'Stations de Vélos', 'Parcs Relais']"
            @updateOption="handleOptionChange" />
        </div>
      </div>
    </div>

    <!-- Nombre de ressources trouvées dans une pastille flottante -->
    <div class="fixed bottom-4 right-4 bg-blue-500 text-white text-sm px-4 py-2 rounded-full shadow-lg z-10">
      <span>
        {{ getResourceCount }} {{ getResourceLabel }} trouvées
      </span>

    </div>

    <!-- Bouton retour -->
    <div class="fixed bottom-4 left-4 bg-blue-500 text-white text-sm px-4 py-2 rounded-full shadow-lg z-10">
      <button @click="goBack">Retour en arrière</button>
    </div>

    <!-- Grille de cartes -->
    <div class="grid-container flex flex-col py-2 min-h-screen flex-grow">

      <div v-if="isShowingSubStat && !isShowingCarParks && filteredSubStat.length > 0"
        class="grid justify-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5 p-4">
        <GlobalCard v-for="subStat in filteredSubStat" :key="subStat.nom" :data="subStat" :type="'StationMetros'"
          @click="showDetails(subStat)" />
      </div>

      <div v-if="!isShowingSubStat && !isShowingCarParks && filteredBikeStat.length > 0"
        class="grid justify-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5 p-4">
        <GlobalCard v-for="bikeStat in filteredBikeStat" :key="bikeStat.nom" :data="bikeStat" :type="'StationVelos'" />
      </div>

      <div v-if="!isShowingSubStat && isShowingCarParks && filteredCarParks.length > 0"
        class="grid justify-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5 p-4">
        <GlobalCard v-for="carPark in filteredCarParks" :key="carPark.nom" :data="carPark" :type="'ParcRelais'" />
      </div>

    </div>

    <SubStationDetail v-if="isModalVisible && isShowingSubStat" :subStat="selectedRessource" :isVisible="isModalVisible"
      @close="closeModal" />

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import UtilsApi from '../Utils/UtilsApi';
import type { BikeStat, CarPark, SubStat } from '../types';
import SubStationDetail from './SubStationDetail.vue';
import SwitchCustom from './SwitchCustom.vue';
import GlobalCard from './GlobalCard.vue';
const subStat = ref<SubStat[]>([]);
const bike = ref<BikeStat[]>([]);
const carPark = ref<CarPark[]>([]);

const filteredSubStat = ref<SubStat[]>([]);
const filteredBikeStat = ref<BikeStat[]>([]);
const filteredCarParks = ref<CarPark[]>([]);
const selectedOption = ref<string>('');

const selectedRessource = ref<SubStat | BikeStat | CarPark | null>(null);

const isShowingSubStat = ref(true);
const isShowingCarParks = ref(false);
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
      dataBike.forEach((velo: any) => {
        allBikes.push(velo);
      });
    }
    bike.value = allBikes;
    filteredBikeStat.value = bike.value;
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API Velo :", error);
  }

  try {
    const allCarParks: CarPark[] = [];
    const dataCarPark = await UtilsApi.performRequest("tco-parcsrelais-star-etat-tr/records", 0, 100);
    if (dataCarPark) {
      dataCarPark.forEach((park: any) => {
        allCarParks.push(park);
      });
    }
    carPark.value = allCarParks;
    filteredCarParks.value = carPark.value;
    console.log(filteredCarParks)
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API Parcs Relais :", error);
  }
});


const handleOptionChange = (option: string) => {
  selectedOption.value = option;
  // Met à jour les données filtrées en fonction de l'option sélectionnée
  if (option.includes('Métro')) {
    filteredSubStat.value = subStat.value;
    filteredBikeStat.value = [];
    filteredCarParks.value = [];
    isShowingSubStat.value = true;
    isShowingCarParks.value = false;

  } else if (option.includes('Vélos')) {
    filteredBikeStat.value = bike.value;
    filteredSubStat.value = [];
    filteredCarParks.value = [];
    isShowingSubStat.value = false;
    isShowingCarParks.value = false;


  } else if (option.includes("Relais")) {
    filteredBikeStat.value = [];
    filteredSubStat.value = [];
    filteredCarParks.value = carPark.value;
    isShowingSubStat.value = false;
    isShowingCarParks.value = true;
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

const getResourceCount = computed(() => {
  if (isShowingSubStat.value) return filteredSubStat.value.length;
  if (!isShowingCarParks.value && !isShowingSubStat) return filteredBikeStat.value.length;
  if (isShowingCarParks.value) return filteredCarParks.value.length;
  return 0;
});

// Propriété calculée pour le libellé des ressources
const getResourceLabel = computed(() => {
  if (isShowingSubStat.value) return 'stations de métros';
  if (!isShowingCarParks.value && !isShowingSubStat) return 'stations de vélos';
  if (isShowingCarParks.value) return 'parcs relais';
  return 'ressources';
});
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
