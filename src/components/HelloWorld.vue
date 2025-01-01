<template>
  <div class="flex flex-col items-center justify-center bg-gray-100 py-8">
    <h1 class="text-2xl font-bold mb-4">Liste des Bus</h1>

    <!-- Filtres -->
    <div class="flex gap-4 mb-6">
      <div>
        <label for="depot" class="block text-gray-700 mb-1">Filtrer par Dépôt</label>
        <select id="depot" v-model="selectedDepot" class="px-4 py-2 border rounded">
          <option value="">Tous les dépôts</option>
          <option v-for="depot in uniqueDepots" :key="depot" :value="depot">
            {{ depot }}
          </option>
        </select>
      </div>

      <div>
        <label for="marque" class="block text-gray-700 mb-1">Filtrer par Marque</label>
        <select id="marque" v-model="selectedBrand" class="px-4 py-2 border rounded">
          <option value="">Toutes les marques</option>
          <option v-for="marque in uniqueBrands" :key="marque" :value="marque">
            {{ marque }}
          </option>
        </select>
      </div>
    </div>


    <div class="flex gap-4 mb-6">
      <!-- Bouton pour appliquer les filtres -->
      <button @click="filterBuses"
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 mb-6">Appliquer les
        filtres</button>

        <button @click="filterBuses"
        class="px-4 py-2  text-white rounded  mb-6 bg-black" disabled>{{ filteredBuses.length }} buses trouvés </button>
    </div>


    <!-- Grille de cartes -->
    <div v-if="filteredBuses.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5 p-4">
      <div v-for="bus in filteredBuses" :key="bus.id" class="bg-white shadow rounded p-4">
        <h2 class="text-lg font-semibold mb-2 text-center">Bus numéro {{ bus.numero }}</h2>
        <p class="text-gray-700">Marque : {{ bus.marque }}</p>
        <p class="text-gray-700">Modèle : {{ bus.modele }}</p>
        <p class="text-gray-700">Dépôt : {{ bus.codedepot }}</p>
      </div>
    </div>


    <!-- Message si aucune donnée -->
    <div v-else class="text-gray-500">
      Aucun bus ne correspond aux critères sélectionnés.
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import UtilsApi from '../Utils/UtilsApi';

const buses = ref([]); // Liste de tous les bus
const filteredBuses = ref([]); // Liste filtrée pour l'affichage
const selectedBrand = ref(""); // Marque sélectionnée pour le filtre
const selectedDepot = ref(""); // Dépôt sélectionné pour le filtre
const seenIds = new Set(); // Set pour suivre les IDs déjà vus

// Fonction pour récupérer les bus
onMounted(async () => {
  try {
    const allBuses = [];
    for (let i = 0; i < 6; i++) {
      const data = await UtilsApi.performRequest("tco-bus-materiel-vehicules-td/records", i * 100, 100);
      if (data && data.results) {
        data.results.forEach((bus) => {
          if (!seenIds.has(bus.id)) {
            seenIds.add(bus.id);
            allBuses.push(bus);
          }
        });
      }
    }
    buses.value = allBuses; // Stocke tous les bus
    filteredBuses.value = buses.value; // Affiche tous les bus initialement
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API :", error);
  }
});

// Méthode pour filtrer les buses par marque ou dépôt
const filterBuses = () => {
  filteredBuses.value = buses.value.filter((bus) => {
    // Filtre par marque et dépôt
    const brandMatch = selectedBrand.value ? bus.marque === selectedBrand.value : true;
    const depotMatch = selectedDepot.value ? bus.codedepot === selectedDepot.value : true;
    return brandMatch && depotMatch;
  });
};

// Calculer la liste unique des marques
const uniqueBrands = computed(() => {
  const brands = buses.value.map((bus) => bus.marque);
  return Array.from(new Set(brands)); // Retirer les doublons
});

// Calculer la liste unique des dépôts
const uniqueDepots = computed(() => {
  const depots = buses.value.map((bus) => bus.codedepot);
  return Array.from(new Set(depots)); // Retirer les doublons
});

</script>