<script setup lang="ts">
import ResponseListComponent from "@/components/Response/ResponseListComponent.vue";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../utils/fetchy";

const props = defineProps(["title"]);
const loaded = ref(false);
let description = ref<Record<string, string>>({});

const getDescription = async (search: string) => {
  let query: Record<string, string> = { search };
  let topic;
  console.log("search", search);
  console.log("query", query);
  try {
    topic = await fetchy("/api/topics", "GET", { query });
  } catch (_) {
    return;
  }
  console.log("topic", topic);
  topic = topic[0];
  description.value = topic.description;
  loaded.value = true;
};

onBeforeMount(async () => {
  await getDescription(props.title);
});
</script>

<template>
  <main>
    <h1>{{ props.title }}</h1>
    <p v-if="loaded">{{ description }}</p>
    <p v-else>Loading...</p>
    <ResponseListComponent :topic="props.title" />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}

p {
  padding: 2em;
}
</style>
