<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const newLabel = ref("");
const allLabels = ref<string[]>([]);
const selectedLabels = ref<string[]>([]);
const emit = defineEmits(["updateLabels"]);

const getLabels = async () => {
  let labelResults;
  try {
    labelResults = await fetchy("/api/label/response/all", "GET");
  } catch (_) {
    return;
  }
  allLabels.value = labelResults.map((labelDoc: any) => labelDoc.title);
};

const toggleLabel = (label: string) => {
  const index = selectedLabels.value.indexOf(label);
  if (index > -1) {
    selectedLabels.value.splice(index, 1); // Remove label if already selected
  } else {
    selectedLabels.value.push(label); // Add label if not selected
  }
  updateLabels();
};

const addLabel = async () => {
  if (newLabel.value && !allLabels.value.includes(newLabel.value)) {
    allLabels.value.push(newLabel.value);
    try {
      await fetchy("/api/label/response", "POST", {
        body: { label: newLabel.value },
      });
    } catch (_) {
      return;
    }
    newLabel.value = ""; // Clear input after adding
  }
};

const updateLabels = () => {
  emit("updateLabels", selectedLabels.value);
};

onBeforeMount(async () => {
  await getLabels();
});
</script>

<template>
  <div class="label-selector">
    <h3>Select Tags for Your Post</h3>
    <div class="checkbox-group">
      <div v-for="label in allLabels" :key="label" class="checkbox-item">
        <input type="checkbox" :id="label" :value="label" @change="toggleLabel(label)" />
        <label :for="label">{{ label }}</label>
      </div>
    </div>
    <div class="new-label">
      <input type="text" v-model="newLabel" placeholder="Create a new label" maxlength="20" />
      <button @click.prevent="addLabel" class="add-button">Add</button>
    </div>
  </div>
</template>

<style scoped>
.label-selector {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  background-color: #f9f9f9;
}

h3 {
  margin-bottom: 15px;
  font-size: 1.5em;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.checkbox-item {
  display: flex;
  align-items: center;
}

input[type="checkbox"] {
  margin-right: 10px;
}

.delete-button {
  margin-left: 10px;
  background-color: #ff4d4d;
  color: white;
  border: none;
  padding: 5px 8px;
  border-radius: 5px;
  cursor: pointer;
}

.new-label {
  margin-top: 15px;
  display: flex;
  align-items: center;
}

.new-label input {
  flex: 1;
  padding: 5px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.add-button {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.submit-button {
  margin-top: 15px;
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
}
</style>
