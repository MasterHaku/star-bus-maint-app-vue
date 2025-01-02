<template>
    <div v-if="isVisible" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-lg w-11/12 lg:w-2/3 xl:w-1/2">
            <h2 class="text-2xl font-bold mb-4">Détails du Bus {{ bus.numero }}</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <p class="text-lg whitespace-nowrap overflow-hidden text-ellipsis">
                    <strong>Marque:</strong> {{ bus.marque }}
                </p>
                <p class="text-lg whitespace-nowrap overflow-hidden text-ellipsis">
                    <strong>Modèle:</strong> {{ bus.modele }}
                </p>
                <p class="text-lg whitespace-nowrap overflow-hidden text-ellipsis">
                    <strong>Dépôt:</strong> {{ bus.codedepot }}
                </p>
                <p class="text-lg whitespace-nowrap overflow-hidden text-ellipsis">
                    <strong>Date de mise en circulation:</strong> {{ bus.datemisecirculation }}
                </p>
                <p class="text-lg whitespace-nowrap overflow-hidden text-ellipsis">
                    <strong>Nombre de valideurs:</strong> {{ bus.nombrevalideurs }}
                </p>
                <p class="text-lg whitespace-nowrap overflow-hidden text-ellipsis">
                    <strong>Nombre de cameras:</strong> {{ bus.nombrecameras }}
                </p>
                <p class="text-lg whitespace-nowrap overflow-hidden text-ellipsis">
                    <strong>Nombre de places assises:</strong> {{ bus.placesassises }}
                </p>
                <p class="text-lg whitespace-nowrap overflow-hidden text-ellipsis">
                    <strong>Nombre de places debout:</strong> {{ bus.placesdebout }}
                </p>
                <p class="text-lg whitespace-nowrap overflow-hidden text-ellipsis">
                    <strong>Nombre de places fauteuil roulant:</strong> {{ bus.nombreplacesufr }}
                </p>
                <p class="text-lg whitespace-nowrap overflow-hidden text-ellipsis">
                    <strong>Autonomie (km):</strong> {{ bus.autonomiekms }}
                </p>
                <p class="text-lg whitespace-nowrap overflow-hidden text-ellipsis">
                    <strong>Type :</strong> {{ bus.type?.[0] ?? "NC" }}
                </p>
                <p class="text-lg whitespace-nowrap overflow-hidden text-ellipsis">
                    <strong>Géré par: </strong> {{
                        bus.codetransporteur === "KREN" ? "Keolis Rennes" :
                        bus.codetransporteur === "TIV" ? "Transdev" :
                        bus.codetransporteur === "JOLL" ? "Jollivet" :
                        bus.codetransporteur === "KARM" ? "Keolis Armor" :
                        bus.codetransporteur === "LINE" ? "Linévia" :
                        bus.codetransporteur === "ORAI" ? "Transport Orain" :
                    "NC"
                    }}
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
import type { Bus } from '../types';


defineProps({
    bus: {
        type: Object as () => Bus,
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

