<script setup lang="ts">
import { ref } from "vue";

const text = ref("");
const emit = defineEmits(["getTopicsByText"]);
</script>

<template>
  <form @submit.prevent="emit('getTopicsByText', text)" class="pure-form">
    <fieldset>
      <!-- <legend>Search</legend> -->
      <input id="text" type="text" v-model="text" placeholder="Search" />
      <button type="submit">Search</button>
      <!-- class="pure-button pure-button-primary" -->
    </fieldset>
  </form>
</template>

<style scoped>
form {
  display: flex;
  gap: 0.5em;
  padding: 1em;
  align-items: center;
}
</style>
