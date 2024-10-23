<script setup lang="ts">
import ResponseListComponent from "@/components/Response/ResponseListComponent.vue";
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../utils/fetchy";

const { isLoggedIn } = storeToRefs(useUserStore());

const props = defineProps(["title"]);
const loaded = ref(false);
let description = ref<Record<string, string>>({});

const getDescription = async (search: string) => {
  let query: Record<string, string> = { search };
  let topic;
  try {
    topic = await fetchy("/api/topics", "GET", { query });
  } catch (_) {
    return;
  }
  topic = topic[0];
  description.value = topic.description;
  loaded.value = true;
};

const navigateToUpdateSide = () => {
  void router.push({ name: "UpdateSidePage", params: { topicTitle: props.title } });
};

const navigateToAddResponse = () => {
  void router.push({ name: "AddResponseToTopicPage", params: { topicTitle: props.title } });
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
    <button v-if="isLoggedIn" @click="navigateToUpdateSide">Update Side</button>
    <button v-if="isLoggedIn" @click="navigateToAddResponse">Respond to {{ props.title }}</button>
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
