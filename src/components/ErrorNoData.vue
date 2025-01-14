<template>
    <div
        class="text-3xl font-bold text-decoration-line: underline mb-2 text-center text-red-600 border-2 border-red-600 rounded-3xl p-3 justify-items-center space-y-6">
        <div>
            <h1 class="">We are sorry, datas for this ressource are not available at this time</h1>

        </div>

        <div class="space-y-2">
            <button class="btn text-white bg-red-600 border-2 border-black rounded-3xl p-2 hover:bg-red-400 text-xl w-[30vh]"
                @click="Reload">
                Reload
            </button>
            <p class="text-xl">Last update moment: {{ updateTime[0] }}</p>
        </div>

    </div>

</template>


<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    updateTime: {
        type: Array as () => string[], // Tableau de chaînes de caractères
        required: true,
    },
    });

const emit = defineEmits();

function Reload() {
    emit('reloadData');
}

</script>