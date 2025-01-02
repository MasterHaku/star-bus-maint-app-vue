<template>
  <div class="flex flex-col items-center justify-center bg-gray-100 py-5">
    <div class="text-center w-full max-w-3xl p-4 bg-white rounded-lg shadow-lg">

      <h1 class="text-2xl font-bold mb-6">Liste des Véhicules</h1>

      <!-- Bloc des filtres -->
      <div class="bg-gray-200 p-4 rounded-lg shadow-md space-y-4">

        <!-- Switch Affichage Bus / Métros -->
        <div class="flex items-center justify-center gap-2 bg-gray-100  py-2 rounded-lg ">

          <label class="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg  cursor-pointer">
            <input type="checkbox" class="toggle-switch" v-model="isShowingBus" @change="switchResource" />
            <span class="text-sm">{{ isShowingBus ? 'Bus' : 'Métros' }}</span>
          </label>

          <div class="flex justify-center">
            <button @click="filterBoth" class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Appliquer les filtres
            </button>
          </div>


        </div>

        <!-- Filtres -->
        <div class="flex flex-wrap justify-center gap-6">
          <div v-if="isShowingBus" class="flex flex-col items-center bg-white p-4 rounded-lg shadow-sm">
            <label for="depot" class="block text-gray-700 mb-2 text-sm font-medium">Filtrer par Dépôt</label>
            <select id="depot" v-model="selectedDepot" class="px-4 py-2 border rounded w-full text-sm">
              <option value="">Tous les dépôts</option>
              <option v-for="depot in uniqueDepots" :key="depot" :value="depot">{{ depot }}</option>
            </select>
          </div>

          <div class="flex flex-col items-center bg-white p-4 rounded-lg shadow-sm">
            <label for="marque" class="block text-gray-700 mb-2 text-sm font-medium">Filtrer par Marque</label>
            <select id="marque" v-model="selectedBrand" class="px-4 py-2 border rounded w-full text-sm">
              <option value="">Toutes les marques</option>
              <option v-for="marque in uniqueBrands" :key="marque" :value="marque">{{ marque }}</option>
            </select>
          </div>


          <div v-if="isShowingBus" class="flex flex-col items-center bg-white p-4 rounded-lg shadow-sm">
            <label for="marque" class="block text-gray-700 mb-2 text-sm font-medium">Filtrer par Exploitant</label>
            <select id="marque" v-model="selectedMaint" class="px-4 py-2 border rounded w-full text-sm">
              <option value="">Tous les exploitants</option>
              <option v-for="maint in uniqueMaintainer" :key="maint" :value="maint">{{ maint }}</option>
            </select>
          </div>

          <div v-if="!isShowingBus" class="flex flex-col items-center bg-white p-4 rounded-lg shadow-sm">
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
        {{ isShowingBus ? filteredBuses.length : filteredMetro.length }} {{ isShowingBus ? 'bus' : 'métros' }} trouvés
      </span>
    </div>



    <!-- Grille de cartes -->
    <div v-if="isShowingBus && filteredBuses.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5 p-4">
      <BusCard v-for="bus in filteredBuses" :key="bus.id" :bus="bus" @click="showDetails(bus)" />
    </div>
    <div v-else-if="!isShowingBus && filteredMetro.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5 p-4">
      <MetroCard v-for="metro in filteredMetro" :key="metro.id" :metro="metro" @click="showDetails(metro)" />
    </div>

    <!-- Message si aucune donnée -->
    <div v-else class="text-gray-500">
      Aucun vehicule ne correspond aux critères sélectionnés.
    </div>

    <!-- Modal de détails du bus -->

    <BusDetail v-if="isModalVisible && isShowingBus" :bus.id="selectedRessource" :isVisible="isModalVisible"
      @close="closeModal" />
    <MetroDetail v-if="isModalVisible && !isShowingBus" :metro.id="selectedRessource" :isVisible="isModalVisible"
      @close="closeModal" />
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import UtilsApi from '../Utils/UtilsApi';
import type { Bus, Metro } from '../types';
import BusCard from './BusCard.vue'; // Importer le composant BusCard
import BusDetail from './BusDetail.vue'; // Importer le composant BusDetailsModal
import MetroCard from './MetroCard.vue';
import MetroDetail from './MetroDetail.vue';

const buses = ref<Bus[]>([]); // Liste de tous les bus
const metros = ref<Metro[]>([]);

const filteredBuses = ref<Bus[]>([]); // Liste filtrée pour l'affichage
const filteredMetro = ref<Metro[]>([]);

const selectedBrand = ref(""); // Marque sélectionnée pour le filtre
const selectedDepot = ref(""); // Dépôt sélectionné pour le filtre
const selectedMaint = ref("");
const selectedLine = ref("");
const selectedRessource = ref<Bus | Metro | null>(null); // Bus sélectionné pour le modal

const seenIdsBus = new Set(); // Set pour suivre les IDs déjà vus
const seenIdsMetro = new Set();

const isShowingBus = ref(true);
const isModalVisible = ref(false); // État pour afficher ou masquer le modal


onMounted(async () => {
  try {
    const allBuses: Bus[] = [];
    for (let i = 0; i < 7; i++) {
      const dataBus = await UtilsApi.performRequest("tco-bus-materiel-vehicules-td/records", i * 100, 100);
      if (dataBus && dataBus.results) {
        dataBus.results.forEach((bus: any) => {
          if (!seenIdsBus.has(bus.id)) {
            seenIdsBus.add(bus.id);
            allBuses.push(bus);
          }
        });
      }
    }
    buses.value = allBuses;
    filteredBuses.value = buses.value;
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API BUS :", error);
  }

  try {
    const allMetros: Metro[] = [];
    const dataMetro = await UtilsApi.performRequest("tco-metro-materiel-vehicules-td/records", 0, 100);
    if (dataMetro && dataMetro.results) {
      dataMetro.results.forEach((metro: any) => {
        if (!seenIdsMetro.has(metro.id)) {
          seenIdsMetro.add(metro.id);
          allMetros.push(metro);
        }
      });
    }
    metros.value = allMetros;
    filteredMetro.value = metros.value
    console.log(metros.value);
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API METRO :", error);
  }

});

const switchResource = () => {
  console.log("ici")
  if (isShowingBus.value) {
    filteredBuses.value = buses.value;
  } else {
    filteredMetro.value = metros.value;
  }
};


const filterBoth = () => {
  if (isShowingBus.value) {
    filteredBuses.value = buses.value.filter((bus) => {
      const brandMatch = selectedBrand.value ? bus.marque === selectedBrand.value : true;
      const depotMatch = selectedDepot.value ? bus.codedepot === selectedDepot.value : true;
      const maintenanceMatch = selectedMaint.value ? bus.codetransporteur == selectedMaint.value : true;





      return brandMatch && depotMatch && maintenanceMatch;
    });
  } else {
    filteredMetro.value = metros.value.filter((metro) => {
      const brandMatch = selectedBrand.value ? metro.marque === selectedBrand.value : true;
      const depotMatch = selectedLine.value ? metro.idligne === selectedLine.value : true;


      return brandMatch && depotMatch;
    });
  }
};


const uniqueBrands = computed(() => {
  const brands = isShowingBus.value
    ? buses.value.map((bus) => bus.marque)
    : metros.value.map((metro) => metro.marque);
  return Array.from(new Set(brands));
});

const uniqueDepots = computed(() => {
  const depots = isShowingBus.value
    ? buses.value.map((bus) => bus.codedepot)
    : metros.value.map((metro) => metro.idligne);
  return Array.from(new Set(depots));
});

const uniqueMaintainer = computed(() => {
  const maint = isShowingBus.value
    ? buses.value.map((bus) => bus.codetransporteur)
    : metros.value.map((metro) => metro.idligne);
  return Array.from(new Set(maint));
});

const uniqueLine = computed(() => {
  const maint = isShowingBus.value
    ? buses.value.map((bus) => bus.codetransporteur)
    : metros.value.map((metro) => metro.idligne);
  return Array.from(new Set(maint));
});



type Ressource = Bus | Metro;
// Méthode pour afficher les détails du bus dans un modal
const showDetails = (ressource: Ressource) => {
  selectedRessource.value = ressource;
  isModalVisible.value = true;
};

// Méthode pour fermer le modal
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
  background-color: #4caf50;
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