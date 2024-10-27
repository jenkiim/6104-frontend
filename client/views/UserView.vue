<script setup lang="ts">
import UserResponsesList from "@/components/Response/UserResponsesList.vue";
import { defineProps } from "vue";

const props = defineProps(["username"]);
</script>

<template>
  <main>
    <h1>Responses by {{ props.username }}</h1>
    <UserResponsesList :username="props.username" />
  </main>
</template>

<style scoped>
main {
  margin: 2em 10em;
}

h1 {
  text-align: center;
}

p {
  padding: 2em;
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1em;
}

.labels {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1em;
}
</style>
