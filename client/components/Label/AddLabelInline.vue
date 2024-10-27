<script setup lang="ts">
import { computed, defineEmits, defineProps, onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["item", "topicOrResponse"]);
const newLabel = ref("");
const allLabels = ref<string[]>([]);
const emit = defineEmits(["updateLabels"]);
const isDropdownOpen = ref(false); // State to control dropdown visibility

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

const addOrAttachLabel = async (label: string) => {
  if (!label) return;

  // If label doesn't exist, create a new one
  if (!allLabels.value.includes(label)) {
    try {
      await fetchy(`/api/label/${props.topicOrResponse}`, "POST", {
        body: { label },
      });
    } catch (_) {
      return;
    }
    allLabels.value.push(label); // Add the label to the list of all labels
  }

  const itemString = props.topicOrResponse === "topic" ? props.item.title : props.item._id;
  const apiUrl = `/api/label/${label}/add/${props.topicOrResponse}/${itemString}`;
  try {
    await fetchy(apiUrl, "PATCH");
  } catch (_) {
    return;
  }
  newLabel.value = ""; // Clear input after adding
  isDropdownOpen.value = false; // Close dropdown after adding
  updateLabels();
};

// Emit updated labels to parent component
const updateLabels = () => {
  emit("updateLabels");
};

// Fetch labels on component mount
onBeforeMount(async () => {
  await getAllLabels();
});

// Computed property for matching labels
const matchingLabels = computed(() => {
  return allLabels.value.filter((label) => label.toLowerCase().includes(newLabel.value.toLowerCase())).slice(0, 10); // Limit to 10 results
});

// Add label when clicked from dropdown
const selectLabel = async (label: string) => {
  await addOrAttachLabel(label);
};

// Handle input focus
const handleFocus = () => {
  isDropdownOpen.value = true; // Open dropdown when input is focused
};

// Handle input blur
const handleBlur = () => {
  setTimeout(() => {
    isDropdownOpen.value = false; // Close dropdown when input loses focus
  }, 100); // Delay to allow click event on dropdown items
};
</script>

<template>
  <div class="label-selector">
    <div class="new-label">
      <input type="text" v-model="newLabel" placeholder="Type and add a new label" maxlength="20" @focus="handleFocus" @blur="handleBlur" />
      <button @click.prevent="addOrAttachLabel(newLabel)" class="add-button">Add</button>
    </div>

    <!-- Dropdown for matching labels -->
    <ul v-if="isDropdownOpen && matchingLabels.length > 0" class="dropdown">
      <li v-for="label in matchingLabels" :key="label" @click="selectLabel(label)" class="dropdown-item">
        {{ label }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.label-selector {
  position: relative;
  width: 280px;
}

h3 {
  margin-bottom: 15px;
  font-size: 1.5em;
}

.new-label {
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

.dropdown {
  position: absolute;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  list-style: none;
  padding: 0;
  margin-top: 5px;
  z-index: 1000;
  max-height: 200px; /* Adjust height if needed */
  overflow-y: auto; /* Scroll if items exceed height */
}

.dropdown-item {
  padding: 5px 10px;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #f0f0f0; /* Highlight on hover */
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
