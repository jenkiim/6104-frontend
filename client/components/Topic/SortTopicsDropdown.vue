<script setup lang="ts">
import { ref } from "vue";

// State to manage whether dropdown is open or closed
const isDropdownOpen = ref(false);

// Toggle the dropdown open/closed
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

// Emit an event to parent with the selected sorting option
const emit = defineEmits(["sortTopics"]);

const selectSortOption = (option: string) => {
  emit("sortTopics", option);
  isDropdownOpen.value = false; // Close the dropdown after selection
};
</script>

<template>
  <div class="sort-dropdown">
    <!-- Button to open/close the dropdown -->
    <button @click="toggleDropdown" class="sort-button">
      Sort Topics
      <span v-if="isDropdownOpen">▲</span>
      <span v-else>▼</span>
    </button>

    <!-- Dropdown menu with sorting options -->
    <div v-if="isDropdownOpen" class="dropdown-menu">
      <button @click="selectSortOption('newest')">Newest</button>
      <button @click="selectSortOption('engagement')">Engagement</button>
      <button @click="selectSortOption('random')">Random</button>
    </div>
  </div>
</template>

<style scoped>
.sort-dropdown {
  position: relative;
  display: inline-block;
}

.sort-button {
  background-color: #007bff;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.sort-button span {
  margin-left: 10px;
}

.dropdown-menu {
  position: absolute;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-top: 5px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.dropdown-menu button {
  background-color: white;
  color: black;
  padding: 8px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  text-align: left;
}

.dropdown-menu button:hover {
  background-color: #f0f0f0;
}
</style>
