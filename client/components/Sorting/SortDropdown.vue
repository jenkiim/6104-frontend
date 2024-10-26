<script setup lang="ts">
import { defineProps, ref } from "vue";

const isDropdownOpen = ref(false);
const props = defineProps(["sortOptions"]);
const currentSort = ref("Sort Topics");

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const emit = defineEmits(["sortItems"]);

const selectSortOption = (option: string) => {
  emit("sortItems", option);
  currentSort.value = option.charAt(0).toUpperCase() + option.slice(1); // captialize the first letter
  isDropdownOpen.value = false; // close the dropdown after selection
};
</script>

<template>
  <div class="sort-dropdown">
    <button @click="toggleDropdown" class="sort-button">
      <span v-if="isDropdownOpen">Sort Topics ▲</span>
      <span v-else>{{ currentSort }}▼</span>
    </button>
    <div v-if="isDropdownOpen" class="dropdown-menu">
      <article v-for="(option, index) in props.sortOptions" :key="index">
        <button @click="selectSortOption(option.value)">{{ option.display }}</button>
      </article>
    </div>
  </div>
</template>

<style scoped>
.sort-dropdown {
  position: relative;
  display: inline-block;
}

/* .sort-button {
  background-color: #007bff;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
} */

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
  width: 100%;
}

.dropdown-menu button:hover {
  background-color: #f0f0f0;
}
</style>
