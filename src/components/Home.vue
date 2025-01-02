<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
      <h1 class="text-4xl font-bold text-gray-800 mb-8">
        Bienvenue sur la page d'accueil
      </h1>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <!-- Première card -->
        <div
          class="card group"
          @click="navigateTo('Vehicles')"
        >
          <div class="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition">
            <h2 class="text-xl font-semibold text-gray-800 group-hover:text-green-500">
              Liste des Vehicules du réseau
            </h2>
          
          </div>
        </div>
  
        <!-- Deuxième card -->
        <div
          class="card group"
          @click="navigateTo('Stations')"
        >
          <div class="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition">
            <h2 class="text-xl font-semibold text-gray-800 group-hover:text-blue-500">
              Liste des Stations du réseau
            </h2>
            
          </div>
        </div>
      </div>
    </div>
  </template>
  
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import { useRouter } from 'vue-router';
  
  export default defineComponent({
    name: 'HomeComponent',
    setup() {
      const router = useRouter();
  
      const navigateTo = (routeName: string) => {
        router.push({ name: routeName });
      };
  
      return { navigateTo };
    },
  });
  </script>
  