<template>
  <div class="w-full max-w-[500px] mx-10">
    <!-- Conteneur du Switch avec bords arrondis -->
    <div class="relative flex w-full h-12 bg-gray-300 rounded-md justify-around">
      <!-- Le switch qui se déplace avec bords arrondis -->
      <div :style="{ transform: 'translateX(' + (position * 100) + '%)' }"
        class="absolute top-0 left-0 w-1/3 h-full bg-blue-500 rounded-md transition-transform duration-300 text-white">
      </div>

      <!-- Clics pour changer de position -->
      <div class="flex w-full h-full">
        <div @click="setPosition(0)" :class="[
          'flex items-center justify-center relative',
          position === 0 ? 'text-white' : 'text-gray-700',
          position === 0 ? 'bg-blue-500' : '',
          position === 0 && 'z-10', // Met le texte de l'option sélectionnée au-dessus
          'px-4 min-w-[120px]' // Assure une largeur minimale pour que le texte ne dépasse pas
        ]">
          {{ props.option1 }}
        </div>
        <div @click="setPosition(1)" :class="[
          'flex items-center justify-center relative',
          position === 1 ? 'text-white' : 'text-gray-700',
          position === 1 ? 'bg-blue-500' : '',
          position === 1 && 'z-10', // Met le texte de l'option sélectionnée au-dessus
          'px-4 min-w-[120px]' // Assure une largeur minimale pour que le texte ne dépasse pas
        ]">
          {{ props.option2 }}
        </div>
        <div @click="setPosition(2)" :class="[
          'flex items-center justify-center relative',
          position === 2 ? 'text-white' : 'text-gray-700',
          position === 2 ? 'bg-blue-500' : '',
          position === 2 && 'z-10', // Met le texte de l'option sélectionnée au-dessus
          'px-4 min-w-[120px]' // Assure une largeur minimale pour que le texte ne dépasse pas
        ]">
          {{ props.option3 }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  option1: {
    type: String,
    required: true,
  },
  option2: {
    type: String,
    required: true,
  },
  option3: {
    type: String,
    required: true,
  },
});

const emit = defineEmits();

// Position initiale à 0 (pour la première option)
const position = ref(0);

// Fonction qui déplace la sélection selon l'option choisie et émet l'option sélectionnée
const setPosition = (index: number) => {
  position.value = index; // La position prend la valeur de l'index
  // Émettre l'option sélectionnée vers le parent
  const selectedOption = index === 0 ? props.option1 : index === 1 ? props.option2 : props.option3;
  emit('updateOption', selectedOption); // Envoie la valeur sélectionnée au parent
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
