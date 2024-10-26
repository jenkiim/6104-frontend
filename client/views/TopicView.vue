<script setup lang="ts">
import DisplayLabels from "@/components/Label/DisplayLabels.vue";
import ResponseListComponent from "@/components/Response/ResponseListComponent.vue";
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../utils/fetchy";

const { isLoggedIn } = storeToRefs(useUserStore());

const props = defineProps(["title"]);
const loaded = ref(false);
const topicObject = ref<Record<string, string>>({});
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
  topicObject.value = topic;
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
    <p class="page-description" v-if="loaded">{{ description }}</p>
    <p v-else>Loading...</p>
    <div class="labels">
      <DisplayLabels v-if="loaded" :item="topicObject" :topicOrResponse="'topic'" />
    </div>
    <div class="actions">
      <button v-if="isLoggedIn" @click="navigateToUpdateSide">Update Side</button>
      <button v-if="isLoggedIn" @click="navigateToAddResponse">Respond to Topic</button>
    </div>
    <ResponseListComponent :topic="props.title" />
  </main>
</template>

<style scoped>
main {
  margin: 0 10%;
  display: flex;
  flex-direction: column;
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
