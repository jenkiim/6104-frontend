<script setup lang="ts">
import { defineEmits, defineProps, ref } from "vue";

const props = defineProps(["sideLeft", "sideRight"]);
const emit = defineEmits(["updateDegree"]);
const degree = ref("");

const options = [
  { display: `Strongly Prefer ${props.sideLeft}`, value: "Strongly Disagree" },
  { display: `Prefer ${props.sideLeft}`, value: "Disagree" },
  { display: `Slightly Prefer ${props.sideLeft}`, value: "Slightly Disagree" },
  { display: "Neutral", value: "Neutral" },
  { display: `Slightly Prefer ${props.sideRight}`, value: "Slightly Agree" },
  { display: `Prefer ${props.sideRight}`, value: "Agree" },
  { display: `Strongly Prefer ${props.sideRight}`, value: "Strongly Agree" },
];

async function onUpdateDegree(newDegree: string) {
  emit("updateDegree", newDegree);
}
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
  padding: 5px 10px;
  border: 1px solid #ccc;
  cursor: pointer;
}
input[type="radio"]:checked + label {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}
</style>
