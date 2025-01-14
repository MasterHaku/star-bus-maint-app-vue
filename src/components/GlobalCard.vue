<template>
    <div class="bg-white">
        <h2 class="text-lg font-semibold mb-2 text-center">
            <template v-if="type === 'subStat'">
                {{ (data as SubStat).nom }}
            </template>
            <template v-else-if="type === 'bus'">
                Bus numéro {{ (data as Bus).numero }}
            </template>
        </h2>


        <!-- Partie Card Station de Métros -->
        <div v-if="type === 'StationMetros'" class="border border-gray-600 rounded p-4">
            <h2 class="text-lg font-semibold mb-2 text-center ">{{ (data as SubStat).nom }}</h2>
            <p class="text-gray-600 font-bold border border-gray-600 rounded px-2 py-1 mb-1">
                Ligne: {{
                    (data as SubStat).idligne === '1001'
                        ? 'Ligne A'
                        : (data as SubStat).idligne === '1002'
                            ? 'Ligne B'
                            : (data as SubStat).idligne
                }}
            </p>
            <p class="text-gray-600 font-bold border border-gray-600 rounded px-2 py-1 mb-1">
                ID: {{ (data as SubStat).idstation }}
            </p>
            <p class="text-gray-700 font-bold border px-2 py-1 rounded mb-1" :class="{
                'text-green-600 border-green-600': (data as SubStat).etat === 'Ouverte',
                'text-red-600 border-red-600': (data as SubStat).etat !== 'Ouverte'
            }">
                Etat: {{ (data as SubStat).etat }}
            </p>
        </div>



        <!-- Partie Card Bus -->
        <div v-else-if="type === 'Bus'">
            <p class="text-gray-700">Marque : {{ (data as Bus).marque }}</p>
            <p class="text-gray-700">Modèle : {{ (data as Bus).modele }}</p>
            <p class="text-gray-700">Dépôt : {{ (data as Bus).codedepot }}</p>
        </div>


        <!-- Partie Card Station de Velos -->
        <div v-else-if="type === 'StationVelos'" class="bg-white rounded p-4" :class="{
            'text-green-600 font-bold border border-green-600': (data as BikeStat).etat[0] === 'En fonctionnement',
            'text-red-600 font-bold border border-red-600': (data as BikeStat).etat[0] !== 'En fonctionnement'
        }">

            <h2 class="text-wrap font-medium mb-2 text-center">{{ (data as BikeStat).nom }}</h2>

            <p class="text-gray-700 border border-gray-600 rounded px-2 py-1 mb-1">Vélos disponibles: {{
                (data as BikeStat).nombrevelosdisponibles }}/{{ (data as BikeStat).nombreemplacementsactuels }}</p>

            <p class="text-gray-700" :class="{
                'text-green-600 font-bold border border-green-600 rounded px-2 py-1 inline-block': (data as BikeStat).etat[0] === 'En fonctionnement',
                'text-red-600 font-bold border border-red-600 rounded px-2 py-1 inline-block': (data as BikeStat).etat[0] !== 'En fonctionnement'
            }">
                Etat: {{ (data as BikeStat).etat[0] }}
            </p>

        </div>

        <div v-else-if="type === 'ParcRelais'" class="bg-white rounded p-4" :class="{
            ' border border-green-600': (data as CarPark).etatouverture === 'OUVERT',
            ' border border-red-600': (data as CarPark).etatouverture !== 'OUVERT'
        }">

            <h2 class="text-lg font-semibold mb-2 text-center">{{ (data as CarPark).nom }}</h2>


            <div class="text-gray-700 border border-gray-600 rounded px-2 py-1 mb-1 ">
                <p>Places disponibles:</p>
                <ul class="space-y-1  list-disc list-inside">
                    <li>Classiques: {{ (data as CarPark).jrdinfosoliste }}/{{ (data as CarPark).capacitesoliste }}</li>
                    <li>
                        PMR: {{ (data as CarPark).jrdinfopmr }}/{{ (data as CarPark).capacitepmr }}
                    </li>
                    <li>
                        Electrique: {{ (data as CarPark).jrdinfoelectrique }}/{{ (data as CarPark).capaciteve }}
                    </li>
                    <li>
                        Covoiturage: {{ (data as CarPark).jrdinfocovoiturage }}/{{ (data as CarPark).capacitecovoiturage
                        }}
                    </li>
                </ul>
                <p>Total: {{ (data as CarPark).capaciteparking - ((data as CarPark).jrdinfocovoiturage + (data as
                    CarPark).jrdinfoelectrique + (data as CarPark).jrdinfopmr) }}/{{ (data as CarPark).capaciteparking
                    }}</p>
            </div>
            <p class="text-gray-700" :class="{
                'text-green-600 font-bold border border-green-600 rounded px-2 py-1 inline-block': (data as CarPark).etatouverture === 'OUVERT',
                'text-red-600 font-bold border border-red-600 rounded px-2 py-1 inline-block': (data as CarPark).etatouverture !== 'OUVERT',
                'text-orange-600 font-bold border border-orange-600 rounded px-2 py-1 inline-block': (data as CarPark).etatremplissage !== 'LIBRE',
            }">
                Etat: {{ (data as CarPark).etatremplissage === 'LIBRE' ? (data as CarPark).etatouverture : (data as
                    CarPark).etatremplissage }}
            </p>
        </div>

        <!-- Partie C Park -->
        <div v-else-if="type === 'C-Parks'" class="bg-white rounded p-4" :class="{
            'border border-green-600': (data as CPark).status === 'OUVERT',
            ' border border-red-600': (data as CPark).status !== 'OUVERT'
        }">

            <h2 class="text-lg font-semibold mb-2 text-center ">{{ (data as CPark).key }}</h2>

            <div class="text-gray-700 border border-gray-600 rounded px-2 py-1 mb-1 ">
                <p>
                    Places libres: {{ (data as CPark).free}}/{{ (data as CPark).max}}
                </p>
            </div>

            <p class="text-gray-700" :class="{
                'text-green-600 font-bold border border-green-600 rounded px-2 py-1 inline-block': (data as CPark).status === 'OUVERT',
                'text-red-600 font-bold border border-red-600 rounded px-2 py-1 inline-block': (data as CPark).status !== 'OUVERT'
            }">
                Etat: {{ (data as CPark).status }}
            </p>

        </div>

    
    </div>




</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import type { SubStat, Bus, BikeStat, CarPark, CPark } from '../types';

// Props : données dynamiques et type
defineProps({
    type: {
        type: String,
        required: true,
        validator: (value: string) => ['StationVelos', 'StationMetros', 'ParcRelais', 'C-Parks'].includes(value),
    },
    data: {
        type: Object as () => SubStat | Bus | BikeStat | CarPark | CPark,
        required: true,
    },
});
</script>