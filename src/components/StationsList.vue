<template>
  <div class="flex flex-col items-center justify-center py-5 ">
    <div class="text-center w-full max-w-xl  p-4 bg-gray-50 rounded-lg shadow-lg border-2 border-starblue">
      <h1 class="text-2xl font-bold mb-6 rounded-lg ">Liste des Stations et Equipements du Réseau de Transport STAR</h1>
      <div
        class="w-full inline-flex justify-center items-center p-4 bg-gray-100 border-2 border-starblue rounded-lg shadow-md">
        <div class="flex w-full items-center justify-center space-x-6">
          <SwitchCustom :titles="['Stations de Métro', 'Stations de Vélos', 'Parcs Relais', 'C-Parks']"
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

      <div v-if="typeRessource == 1 && filteredSubStat.length > 0"
        class="grid justify-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5 p-4">
        <GlobalCard v-for="subStat in filteredSubStat" :key="subStat.nom" :data="subStat" :type="'StationMetros'"
          @click="showDetails(subStat)" />
      </div>

      <div v-if="typeRessource == 2 && filteredBikeStat.length > 0"
        class="grid justify-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5 p-4">
        <GlobalCard v-for="bikeStat in filteredBikeStat" :key="bikeStat.nom" :data="bikeStat" :type="'StationVelos'" />
      </div>

      <div v-if="typeRessource == 3 && filteredCarParks.length > 0"
        class="grid justify-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5 p-4">
        <GlobalCard v-for="carPark in filteredCarParks" :key="carPark.nom" :data="carPark" :type="'ParcRelais'" />
      </div>


      <div v-if="typeRessource == 4 && filteredCParks.length > 0"
        class="grid justify-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5 p-4">
        <GlobalCard v-for="cPark in filteredCParks" :key="cPark.key" :data="cPark" :type="'C-Parks'" />
      </div>

    </div>

    <SubStationDetail v-if="isModalVisible && typeRessource == 1" :subStat="selectedRessource"
      :isVisible="isModalVisible" @close="closeModal" />

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import UtilsApi from '../Utils/UtilsApi';
import type { BikeStat, CarPark, CPark, SubStat } from '../types';
import SubStationDetail from './SubStationDetail.vue';
import SwitchCustom from './SwitchCustom.vue';
import GlobalCard from './GlobalCard.vue';


const subStat = ref<SubStat[]>([]);
const bike = ref<BikeStat[]>([]);
const carPark = ref<CarPark[]>([]);
const cPark = ref<CPark[]>([]);

const filteredSubStat = ref<SubStat[]>([]);
const filteredBikeStat = ref<BikeStat[]>([]);
const filteredCarParks = ref<CarPark[]>([]);
const filteredCParks = ref<CPark[]>([]);
const selectedOption = ref<string>('');

const selectedRessource = ref<SubStat | BikeStat | CarPark | null>(null);

const typeRessource = ref(1);
const isModalVisible = ref(false);

onMounted(async () => {
  try {
    const allSubStat: SubStat[] = [];
    const dataSubStat = await UtilsApi.performRequest("Star", "tco-metro-stations-etat-tr/records", 0, 100);
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
    const dataBike = await UtilsApi.performRequest("Star", "vls-stations-etat-tr/records", 0, 100);
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
    const dataCarPark = await UtilsApi.performRequest("Star", "tco-parcsrelais-star-etat-tr/records", 0, 100);
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

  try {
    const allCParks: CPark[] = [];
    const dataCPark = await UtilsApi.performRequest("Citédia", "export-api-parking-citedia/records", 0, 100)
    if (dataCPark) {
      dataCPark.forEach((park: any) => {
        allCParks.push(park);
      });
    }
    cPark.value = allCParks;
    filteredCParks.value = cPark.value;
    console.log(filteredCParks)
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
    filteredCParks.value = [];

    typeRessource.value = 1;

  } else if (option.includes('Vélos')) {
    filteredBikeStat.value = bike.value;
    filteredSubStat.value = [];
    filteredCarParks.value = [];
    filteredCParks.value = [];

    typeRessource.value = 2;


  } else if (option.includes("Relais")) {
    filteredBikeStat.value = [];
    filteredSubStat.value = [];
    filteredCParks.value = []; //
    filteredCarParks.value = carPark.value;
    typeRessource.value = 3;
  }
  else if (option.includes("C-Parks")) {
    filteredBikeStat.value = [];
    filteredSubStat.value = [];
    filteredCParks.value = cPark.value; //
    filteredCarParks.value = [];

    typeRessource.value = 4;
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

  switch (typeRessource.value) {
    case 1:
      return filteredSubStat.value.length;;
    case 2:
      return filteredBikeStat.value.length;
    case 3:
      return filteredCarParks.value.length;
    case 4:
      return filteredCParks.value.length;
    default:
      return 0;
  }

});

// Propriété calculée pour le libellé des ressources
const getResourceLabel = computed(() => {
  switch (typeRessource.value) {
    case 1:
      return 'stations de métros';
    case 2:
      return 'stations de vélos';
    case 3:
      return 'parcs relais';
    case 4:
      return 'C-Parks';
    default:
      return 'ressources';
  }

});
</script>












<style>

</style>
