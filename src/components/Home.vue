<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">

    <h1 class="text-4xl font-bold text-gray-800 mb-8">
      Repertoire des vehicules et stations de la STAR
    </h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div class="card group" @click="navigateTo('Vehicles')">
        <div class="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition border-2 border-starblue">
          <h2 class="text-xl font-semibold text-stargreen group-hover:text-staryellow">
            Liste des Vehicules du réseau
          </h2>

        </div>
      </div>

      <div class="card group" @click="navigateTo('Stations')">
        <div class="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition border-2 border-starblue">
          <h2 class="text-xl font-semibold text-stargreen group-hover:text-staryellow">
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