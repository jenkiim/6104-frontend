<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { computed, defineEmits, defineProps, onBeforeMount, ref, toRaw } from "vue";

const props = defineProps(["topicOrResponse"]);
const allLabels = ref<string[]>([]);
const selectedFilters = ref<string[]>([]);
const searchQuery = ref("");
const showDropdown = ref(false);
const emit = defineEmits(["filterItems"]);

const getAllLabels = async () => {
  // Fetch all labels from the server
  const apiUrl = `/api/label/${props.topicOrResponse}/all`;
  let labels;
  try {
    labels = await fetchy(apiUrl, "GET");
  } catch (_) {
    return;
  }
  allLabels.value = labels.map((labelDoc: any) => labelDoc.title);
};

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const filteredLabels = computed(() => {
  return allLabels.value.filter((label) => label.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

const addFilter = (label: string) => {
  if (!selectedFilters.value.includes(label) && selectedFilters.value.length < 3) {
    selectedFilters.value.push(label);
  }
  emit("filterItems", toRaw(selectedFilters.value));
};

const removeSelectedFilter = (filter: string) => {
  selectedFilters.value = selectedFilters.value.filter((selectedFilter) => selectedFilter !== filter);
  emit("filterItems", toRaw(selectedFilters.value));
};

onBeforeMount(async () => {
  await getAllLabels();
});
</script>

<template>
  <div class="filter-container">
    <div class="filter-dropdown">
      <button @click="toggleDropdown" class="dropdown-button">
        Filters <span v-if="selectedFilters.length">({{ selectedFilters.length }})</span>
      </button>
      <div v-if="showDropdown" class="dropdown-options">
        <input type="text" v-model="searchQuery" placeholder="Search labels" class="search-input" />
        <ul>
          <li v-for="label in filteredLabels" :key="label" @click="addFilter(label)" :class="{ disabled: selectedFilters.includes(label) || selectedFilters.length >= 3 }">
            {{ label }}
          </li>
        </ul>
        <button @click="toggleDropdown" class="done-button">Close</button>
      </div>
    </div>
    <div class="selected-filters">
      <span v-for="filter in selectedFilters" :key="filter" class="filter-tag">
        {{ filter }}
        <button @click="removeSelectedFilter(filter)">X</button>
      </span>
    </div>
  </div>
</template>

<style scoped>
.filter-container {
  display: flex;
  align-items: center;
}

.filter-dropdown {
  position: relative;
}

.dropdown-button {
  padding: 8px 16px;
  cursor: pointer;
}

.dropdown-options {
  position: absolute;
  top: 100%;
  left: 0;
  border: 1px solid #ccc;
  background: white;
  width: 200px;
  padding: 8px;
  z-index: 10;
}

.search-input {
  width: 100%;
  padding: 4px;
  margin-bottom: 8px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
}

li:hover {
  background-color: #eaeaea;
}

li.disabled {
  color: #999;
  cursor: not-allowed;
}

.done-button {
  margin-top: 8px;
  width: 100%;
  padding: 6px 0;
  cursor: pointer;
}

.selected-filters {
  margin-left: 16px;
  display: flex;
  gap: 8px;
}

.filter-tag {
  background-color: #007bff;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
}
</style>
