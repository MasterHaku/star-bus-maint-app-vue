<template>
  <div class="w-full max-w-[500px] mx-10 ">
    <!-- Conteneur du Switch avec bords arrondis -->
    <div class="relative flex w-full h-12 bg-gray-300 rounded-md justify-around">
      <!-- Le switch qui se déplace avec bords arrondis -->
      <div :style="{
        transform: 'translateX(' + (position * 100) + '%)',
        width: (100 / props.titles.length) + '%'
      }" class="absolute top-0 left-0  h-full bg-blue-500 rounded-md transition-transform duration-300 text-white">
      </div>

      <!-- Clics pour changer de position -->
      <div class="flex w-full h-full  ">

        <div v-for="(title, index) in props.titles" :key="index" @click="setPosition(index)" :class="[
          'flex items-center justify-center relative',
          position === index ? 'text-white' : 'text-gray-700',
          position === index && 'z-10', // Met le texte de l'option sélectionnée au-dessus
          'px-4 min-w-[120px]' // Assure une largeur minimale pour que le texte ne dépasse pas
        ]">
          {{ title }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  titles: {
    type: Array as () => string[], // Tableau de chaînes de caractères
    required: true,
    validator: (value: string[]) => value.length >= 2,
  },
  
});

const emit = defineEmits();

// Position initiale à 0 (pour la première option)
const position = ref(0);

// Fonction qui déplace la sélection selon l'option choisie et émet l'option sélectionnée
const setPosition = (index: number) => {

  position.value = index;
  emit('updateOption', props.titles[index]);
  console.log(index)
};
</script>

<style scoped>
/* Bords arrondis sur le conteneur du switch */
.relative {
  border-radius: 1.5rem;
}

.absolute {
  border-radius: 1.5rem;
}
</style>
