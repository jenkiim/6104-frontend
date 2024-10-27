<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { defineEmits, defineProps, onBeforeMount, ref } from "vue";
import { useUserStore } from "../../stores/user";

const props = defineProps(["sideLeft", "sideRight", "addOrFilter", "options", "currentDegree", "topic"]);
const emit = defineEmits(["updateDegree"]);
const degree = ref(props.currentDegree);
const userDegree = ref("");
const { currentUsername } = storeToRefs(useUserStore());

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

const fetchDegree = async () => {
  let query: Record<string, string> = { user: currentUsername.value, topic: props.topic };
  let currentDegree;
  try {
    currentDegree = await fetchy(`/api/side`, "GET", { query, alert: false });
  } catch (_) {
    return;
  }
  userDegree.value = currentDegree[0].degree;
};

onBeforeMount(async () => {
  await fetchDegree();
});
</script>

<template>
  <div class="opinion-selector">
    <div v-for="(option, index) in options" :key="index" class="opinion-button">
      <input type="radio" :id="option.display" :value="option.value" v-model="degree" @click="onUpdateDegree(option.value)" />
      <label :for="option.display" :class="{ 'user-degree-button': option.value === userDegree }">{{ option.display }}</label>
    </div>
  </div>
</template>

<style scoped>
.opinion-selector {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 1em;
  align-items: center;
}

.opinion-button {
  text-align: center;
  width: auto;
  max-width: 12.5%;
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
  display: block;
  overflow-wrap: break-word;
  word-break: break-word;
  white-space: normal;
}

input[type="radio"] + label:hover {
  background-color: #e6e6e6;
}

input[type="radio"]:checked + label {
  background-color: var(--signature-light);
  color: white;
}

input[type="radio"]:checked + label:hover {
  background-color: var(--signature-lighter);
}

.user-degree-button {
  background-color: var(--signature-lightest);
}
</style>
