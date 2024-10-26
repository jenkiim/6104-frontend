<script setup lang="ts">
import UpdateSideForm from "@/components/Side/UpdateSideForm.vue";

const props = defineProps(["topicTitle"]);
</script>

<template>
  <main>
    <UpdateSideForm :topicTitle="props.topicTitle"></UpdateSideForm>
  </main>
</template>

<style scoped>
main {
  margin: 5em 10em;
}

h1 {
  text-align: center;
}

p {
  padding: 2em;
}

form {
  background-color: var(--base-bg);
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  border-radius: 4px;
  resize: none;
}

p {
  margin: 0em;
}

.author {
  font-weight: bold;
  font-size: 1.2em;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}
</style>
