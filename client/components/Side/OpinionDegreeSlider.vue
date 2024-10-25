<script setup lang="ts">
import { defineEmits, defineProps, ref } from "vue";

const props = defineProps(["sideLeft", "sideRight", "addOrFilter", "options"]);
const emit = defineEmits(["updateDegree"]);
const degree = ref("");

const onUpdateDegree = async (newDegree: string) => {
  if (props.addOrFilter === "filter") {
    if (degree.value === newDegree) {
      degree.value = ""; // Deselect if already selected
    } else {
      degree.value = newDegree;
    }
  } else {
    degree.value = newDegree;
  }
  emit("updateDegree", degree.value);
};
</script>

<template>
  <div class="opinion-selector">
    <div v-for="(option, index) in options" :key="index" class="opinion-button">
      <input type="radio" :id="option.display" :value="option.value" v-model="degree" @click="onUpdateDegree(option.value)" />
      <label :for="option.display">{{ option.display }}</label>
    </div>
  </div>
</template>

<style scoped>
.opinion-selector {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.opinion-button {
  text-align: center;
}

input[type="radio"] {
  display: none;
}

input[type="radio"] + label {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  user-select: none;
}

input[type="radio"] + label:hover {
  background-color: #e6e6e6;
}

input[type="radio"]:checked + label {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

input[type="radio"]:checked + label:hover {
  background-color: #0056b3;
}
</style>
