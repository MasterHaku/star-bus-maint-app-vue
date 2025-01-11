<template>
  <div class="flex flex-col items-center justify-center border-1 border-stargreen py-5">
    <div class="text-center w-full max-w-3xl p-4 bg-gray-50 rounded-lg shadow-lg">

      <h1 class="text-2xl font-bold mb-6 rounded-lg ">Liste des Stations et Equipements du Reseau de Transport STAR</h1>

      <div class="border-2 border-starblue p-4 rounded-lg shadow-md space-y-4 bg-gray-100">

        <div class="flex items-center justify-center gap-2 bg-gray-100 border-2 border-stargreen  py-2 rounded-lg ">

          <label
            class="flex items-center gap-2 bg-gray-100 text-black px-4 py-2 rounded-lg cursor-pointer border-2 border-stargreen ">
            <input type="checkbox" class="toggle-switch" v-model="isShowingSubStat" @change="switchResource" />
            <span class="text-sm items-end">{{ isShowingSubStat ? 'Stations de Métros' : 'Stations de Vélos' }}</span>
          </label>

          <div class="flex justify-center">
            <button @click="filterBoth"
              class="px-6 py-2 bg-gray-100 border-2 border-stargreen text-black rounded-lg hover:bg-gray-200">
              Appliquer les filtres
            </button>
          </div>

          <div v-if="!isShowingSubStat" class="flex flex-col items-center bg-white p-4 rounded-lg shadow-sm">
            <label for="marque" class="block text-gray-700 mb-2 text-sm font-medium">Filtrer par Ligne</label>
            <select id="marque" v-model="selectedLine" class="px-4 py-2 border rounded w-full text-sm">
              <option value="">Toutes les lignes</option>
              <option v-for="line in uniqueLine" :key="line" :value="line">
                {{ line === '1001' ? 'Ligne A' : line === '1002' ? 'Ligne B' : line }}
              </option>
            </select>
          </div>

        </div>



      </div>
    </div>

    <!-- Nombre de ressources trouvées dans une pastille flottante -->
    <div class="fixed bottom-4 right-4 bg-blue-500 text-white text-sm px-4 py-2 rounded-full shadow-lg">
      <span>
        {{ isShowingSubStat ? filteredSubStat.length : 0 }} {{ isShowingSubStat ? 'stations de métros' : 'stations de vélos' }} trouvés
      </span>
    </div>

    <div class="fixed bottom-4 left-4 bg-blue-500 text-white text-sm px-4 py-2 rounded-full shadow-lg">
      <button @click="goBack">Retour en arrière</button>
    </div>


    <!-- Grille de cartes -->
    <div v-if="isShowingSubStat && filteredSubStat.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5 p-4">
      <SubStationCard v-for="subStat in filteredSubStat" :key="subStat.nom" :sub-stat="subStat"
        @click="showDetails(subStat)" />
    </div>

    <!-- Message si aucune donnée -->
    <div v-else>
      <div v-if="openedPopup && (filteredSubStat.length > 0)" class="fixed inset-0  flex items-center justify-center"
        @click="closePopup">
        <div class=" bg-red-600  text-white p-4 rounded-full text-xl ">
          Aucun véhicule ne correspond aux critères sélectionnés
        </div>
      </div>
    </div>
    <!-- Modal de détails du bus -->

    <SubStationDetail v-if="isModalVisible && isShowingSubStat" :subStat="selectedRessource" :isVisible="isModalVisible"
      @close="closeModal" />

  </div>
</template>


<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import UtilsApi from '../Utils/UtilsApi';
import type { SubStat } from '../types';
import SubStationCard from './SubStationCard.vue';
import SubStationDetail from './SubStationDetail.vue';


// Listes de tous les elements
const subStat = ref<SubStat[]>([]);
//const metros = ref<Metro[]>([]);

const filteredSubStat = ref<SubStat[]>([]);
//const filteredMetro = ref<Metro[]>([]);

// Constantes pour les filtres
//const selectedBrand = ref("");
//const selectedDepot = ref("");
//const selectedMaint = ref("");
const selectedLine = ref("");

const openedPopup = ref(true);

// Ressource selectionée pour la Card
const selectedRessource = ref<SubStat | null>(null);

// Set pour suivre les IDs déjà vus
//const seenIdsMetro = new Set();

//Etats divers
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

  // try {
  //   const allMetros: Metro[] = [];
  //   const dataMetro = await UtilsApi.performRequest("tco-metro-materiel-vehicules-td/records", 0, 100);
  //   if (dataMetro) {
  //     dataMetro.forEach((metro: any) => {
  //       if (!seenIdsMetro.has(metro.id)) {
  //         seenIdsMetro.add(metro.id);
  //         allMetros.push(metro);
  //       }
  //     });
  //   }
  //   metros.value = allMetros;
  //   filteredMetro.value = metros.value
  //   console.log(metros.value);
  // } catch (error) {
  //   console.error("Erreur lors de l'appel à l'API METRO :", error);
  // }

});

const switchResource = () => {
  if (isShowingSubStat.value) {
    filteredSubStat.value = subStat.value;
  }
  // else {
  //   filteredMetro.value = metros.value;
  // }
};

const goBack = () => {
  window.history.back();
};

const closePopup = () => {
  openedPopup.value = false;
  //selectedDepot.value = "";
  //selectedBrand.value = "";
  selectedLine.value = "";
  //selectedMaint.value = "";
  filterBoth();
};

const filterBoth = () => {
  if (isShowingSubStat.value) {
    filteredSubStat.value = subStat.value.filter((subStat) => {
      //const brandMatch = selectedBrand.value ? bus.marque === selectedBrand.value : true;
      const lineMatch = selectedLine.value ? subStat.idligne === selectedLine.value : true;
      //const maintenanceMatch = selectedMaint.value ? bus.codetransporteur == selectedMaint.value : true;
      return lineMatch;
    });
  }
  // else {
  //   filteredMetro.value = metros.value.filter((metro) => {
  //     const brandMatch = selectedBrand.value ? metro.marque === selectedBrand.value : true;
  //     const depotMatch = selectedLine.value ? metro.idligne === selectedLine.value : true;
  //     return brandMatch && depotMatch;
  //   });
  // }
};






const uniqueLine = computed(() => {
  let maint = [""];
  if (isShowingSubStat.value) {
    maint = subStat.value.map((subStat) => subStat.idligne)
  }

  return Array.from(new Set(maint));
});



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



<style scoped>
/* Vous pouvez personnaliser ici si nécessaire */
</style>