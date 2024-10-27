<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
import UserResponseComponent from "./UserResponseComponent.vue";

const props = defineProps(["username"]);
const loaded = ref(false);
let responses = ref<Array<Record<string, string>>>([]);

const getResponses = async () => {
  let apiUrl = `/api/responses/topic`;
  let query: Record<string, string> = { author: props.username };
  let responseResults: Record<string, string>[];
  // get responses to topics
  try {
    responseResults = await fetchy(apiUrl, "GET", { query, alert: false });
  } catch (_) {
    return;
  }
  responses.value = responseResults;
};

onBeforeMount(async () => {
  await getResponses();
  loaded.value = true;
});
</script>

<template>
  <section class="responses" v-if="loaded && responses.length !== 0">
    <article v-for="response in responses" :key="response._id">
      <UserResponseComponent :response="response" @refreshResponses="getResponses()" />
    </article>
  </section>
  <p v-else-if="loaded">No responses found</p>
  <p v-else>Loading...</p>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.responses {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style>
