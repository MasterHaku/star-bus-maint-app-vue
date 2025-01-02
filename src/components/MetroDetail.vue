<template>
    <div v-if="isVisible" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-lg w-11/12 lg:w-2/3 xl:w-1/2">
            <h2 class="text-2xl font-bold mb-4">Détails de la Rame n°{{ metro.numero }}</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <p class="text-lg whitespace-nowrap overflow-hidden text-ellipsis">
                    <strong>Marque:</strong> {{ metro.marque }}
                </p>
                <p class="text-lg whitespace-nowrap overflow-hidden text-ellipsis">
                    <strong>Modèle:</strong> {{ metro.modele }}
                </p>
                <p class="text-lg whitespace-nowrap overflow-hidden text-ellipsis">
                    <strong>Nom:</strong> {{ metro.nom }}
                </p>
                <p class="text-lg whitespace-nowrap overflow-hidden text-ellipsis">
                    <strong>Version:</strong> {{ metro.version }}
                </p>
                <p class="text-lg whitespace-nowrap overflow-hidden text-ellipsis">
                    <strong>Ligne:</strong> {{ metro.idligne === '1001' ? 'Ligne A - ' + metro.idligne : metro.idligne === '1002' ? 'Ligne B - '+ metro.idligne : metro.idligne  }}
                </p>
                <p class="text-lg whitespace-nowrap overflow-hidden text-ellipsis">
                    <strong>Longueur:</strong> {{ metro.longueur }} mètres
                </p>
                
                <p class="text-lg whitespace-nowrap overflow-hidden text-ellipsis">
                    <strong>Nombre de places assises:</strong> {{ metro.placesassises }}
                </p>
                <p class="text-lg whitespace-nowrap overflow-hidden text-ellipsis">
                    <strong>Nombre de places debout:</strong> {{ metro.placesdebout }}
                </p>
                <p class="text-lg whitespace-nowrap overflow-hidden text-ellipsis">
                    <strong>Nombre de places fauteuil roulant:</strong> {{ metro.nombreplacesufr }}
                </p>
                <p class="text-lg whitespace-nowrap overflow-hidden text-ellipsis">
                    <strong>Nombre de places total:</strong> {{ metro.placestotales }}
                </p>
                <p class="text-lg whitespace-nowrap overflow-hidden text-ellipsis">
                    <strong>Date de mise en service:</strong> {{ metro.datemiseservice }}
                </p>
               
            </div>
            <div class="mt-4 flex justify-end">
                <button @click="closeModal" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Fermer
                </button>
            </div>
        </div>
    </div>
</template>



<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import type {  Metro } from '../types';

const props = defineProps({
    metro: {
        type: Object as () => Metro,
        required: true,
    },
    isVisible: {
        type: Boolean,
        required: true,
    },
});

const emit = defineEmits(['close']);

const closeModal = () => {
    emit('close');
};
</script>

