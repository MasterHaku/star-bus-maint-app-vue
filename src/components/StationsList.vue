<template>
  <div class="flex flex-col items-center justify-center py-5 px-5 ">
    <div class="text-center w-full max-w-[100vh]  p-4 bg-gray-50 rounded-lg shadow-lg border-2 border-starblue">
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
        {{ getResourceCount }} {{ getResourceLabel }} trouvées | Mis a jour a {{ updateDate[0] }}
      </span>

    </div>

    <!-- Bouton retour -->
    <div class="fixed bottom-4 left-4 bg-blue-500 text-white text-sm px-4 py-2 rounded-full shadow-lg z-10">
      <button @click="goBack">Retour en arrière</button>
    </div>

    <div v-if="getResourceCount <= 0" class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
      <ErrorNoData :update-time="updateDate" @reloadData="handleUpdateRequired" />
    </div>


    <!-- Grille de cartes PC-->
    <div class="hidden lg:flex grid-container flex-col py-2 min-h-screen flex-grow">

      <div v-if="typeRessource == 1 && filteredSubStat.length > 0"
        class="grid justify-center lg:grid-cols-4 xl:grid-cols-6 gap-5 p-4">
        <GlobalCard v-for="subStat in filteredSubStat" :key="subStat.nom" :data="subStat" :type="'StationMetros'"
          @click="showDetails(subStat)" />
      </div>

      <div v-if="typeRessource == 2 && filteredBikeStat.length > 0"
        class="grid justify-center lg:grid-cols-4 xl:grid-cols-6 gap-5 p-4">
        <GlobalCard v-for="bikeStat in filteredBikeStat" :key="bikeStat.nom" :data="bikeStat" :type="'StationVelos'" />
      </div>

      <div v-if="typeRessource == 3 && filteredCarParks.length > 0"
        class="grid justify-center lg:grid-cols-4 xl:grid-cols-6 gap-5 p-4">
        <GlobalCard v-for="carPark in filteredCarParks" :key="carPark.nom" :data="carPark" :type="'ParcRelais'" />
      </div>


      <div v-if="typeRessource == 4">
        <div v-if="filteredCParks.length > 0" class="grid justify-center lg:grid-cols-4 xl:grid-cols-6 gap-5 p-4">
          <GlobalCard v-for="cPark in filteredCParks" :key="cPark.key" :data="cPark" :type="'C-Parks'" />
        </div>
      </div>




      <SubStationDetail v-if="isModalVisible && typeRessource == 1" :subStat="(selectedRessource as SubStat)"
        :isVisible="isModalVisible" @close="closeModal" />

    </div>





  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue';
import UtilsApi from '../Utils/UtilsApi';
import type { BikeStat, CarPark, CPark, SubStat } from '../types';
import SubStationDetail from './SubStationDetail.vue';
import SwitchCustom from './SwitchCustom.vue';
import GlobalCard from './GlobalCard.vue';
import ErrorNoData from './ErrorNoData.vue';

let intervalId: number;
const updateDate = ref<string[]>([]);

const subStat = ref<SubStat[]>([]);
const bike = ref<BikeStat[]>([]);
const carPark = ref<CarPark[]>([]);
const cPark = ref<CPark[]>([]);

const filteredSubStat = ref<SubStat[]>([]);
const filteredBikeStat = ref<BikeStat[]>([]);
const filteredCarParks = ref<CarPark[]>([]);
const filteredCParks = ref<CPark[]>([]);
const selectedOption = ref<string>('');

const selectedRessource = ref<SubStat | BikeStat | CarPark | CPark | null>(null);

const typeRessource = ref(1);
const isModalVisible = ref(false);

onMounted(async () => {
  getAllData();
  intervalId = setInterval(getAllData, 60000 * 2)
});

onUnmounted(async () => {
  clearInterval(intervalId);
})


async function getMetroData() {
  if (filteredSubStat.value.length <= 0) {
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
  }

}

async function getCarParkData() {
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
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API Parcs Relais :", error);
  }
}

async function getBikeData() {
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
}

async function getCParkData() {
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
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API Parcs Relais :", error);
  }
}

async function getAllData() {
  getMetroData();
  getBikeData();
  getCParkData();
  getCarParkData();
  updateTime();
  console.log("Get All Data");

}

const updateTime = () => {
  updateDate.value = [(new Date).getHours().toString().padStart(2, '0') + ":" + (new Date).getMinutes().toString().padStart(2, '0')];

}

const handleOptionChange = (option: string) => {
  selectedOption.value = option;
  // Met à jour les données filtrées en fonction de l'option sélectionnée
  if (option.includes('Métro')) {
    filteredSubStat.value = subStat.value;
    typeRessource.value = 1;
  } else if (option.includes('Vélos')) {
    filteredBikeStat.value = bike.value;
    typeRessource.value = 2;
  } else if (option.includes("Relais")) {
    filteredCarParks.value = carPark.value;
    typeRessource.value = 3;
  }
  else if (option.includes("C-Parks")) {
    filteredCParks.value = cPark.value; //
    typeRessource.value = 4;
  }
};
const handleUpdateRequired = () => {
  updateTime();
  switch (typeRessource.value) {
    case 1:
      return getMetroData();
    case 2:
      return getBikeData();
    case 3:
      return getCarParkData();
    case 4:
      return getCParkData();
    default:
      return 0;
  }
}



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
