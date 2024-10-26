<script setup lang="ts">
import { defineEmits, defineProps, onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["topicOrResponse"]);
const newLabel = ref("");
const allLabels = ref<string[]>([]);
const selectedLabels = ref<string[]>([]);
const emit = defineEmits(["updateLabels"]);

// Fetch existing labels
const getAllLabels = async () => {
  let labelResults;
  try {
    labelResults = await fetchy(`/api/label/${props.topicOrResponse}/all`, "GET");
  } catch (_) {
    return;
  }
  allLabels.value = labelResults.map((labelDoc: any) => labelDoc.title);
};

const addOrAttachLabel = async () => {
  if (!newLabel.value) return;
  const label = newLabel.value;
  // if label doesn't exist, make one
  if (!allLabels.value.includes(label)) {
    // new label
    try {
      await fetchy(`/api/label/${props.topicOrResponse}`, "POST", {
        body: { label },
      });
    } catch (_) {
      return;
    }
    allLabels.value.push(label); // Add the label to the list of all labels
  }
  selectedLabels.value.push(label); // Add label to selected labels
  newLabel.value = ""; // Clear input after adding
  updateLabels();
};

// Emit updated labels to parent component
const updateLabels = () => {
  emit("updateLabels", selectedLabels.value);
};

// Fetch labels on component mount
onBeforeMount(async () => {
  await getAllLabels();
});
</script>

<template>
  <div>
    <div class="label-selector">
      <div class="new-label">
        <input type="text" v-model="newLabel" placeholder="Type and add a new label" maxlength="20" />
        <button @click.prevent="addOrAttachLabel" class="add-button">Add</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
h3 {
  margin-bottom: 15px;
  font-size: 1.5em;
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

.selected-labels {
  display: flex;
  flex-wrap: wrap;
  margin-top: 15px;
}

.label {
  background-color: #007bff;
  color: white;
  padding: 5px 10px;
  margin-right: 10px;
  border-radius: 5px;
}

.delete-button {
  margin-left: 10px;
  background-color: #ff4d4d;
  color: white;
  border: none;
  padding: 5px;
  border-radius: 50%;
  cursor: pointer;
}
</style>
