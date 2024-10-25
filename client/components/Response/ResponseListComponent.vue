<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
import SortDropdown from "../Sorting/SortDropdown.vue";
import ResponseComponent from "./ResponseComponent.vue";

// const { isLoggedIn } = storeToRefs(useUserStore());
const props = defineProps(["topic"]);
const sort = ref("newest");

const loaded = ref(false);
let responses = ref<Array<Record<string, string>>>([]);

const getResponses = async (sort: string, topic: string) => {
  const apiUrl = `/api/responses/topic/${topic}/sort`;
  let query: Record<string, string> = { sort };
  let responseResults;
  try {
    responseResults = await fetchy(apiUrl, "GET", { query });
  } catch (_) {
    return;
  }
  responses.value = responseResults.responses;
};

const handleSortResponses = async (option: string) => {
  sort.value = option;
  await getResponses(option, props.topic);
};

onBeforeMount(async () => {
  await getResponses(sort.value, props.topic);
  loaded.value = true;
});

const options = [
  { display: "Newest", value: "newest" },
  { display: "Random", value: "random" },
  { display: "Upvotes", value: "upvotes" },
  { display: "Downvotes", value: "downvotes" },
  { display: "Controversial", value: "controversial" },
];
</script>

<template>
  <SortDropdown :sortOptions="options" @sortItems="handleSortResponses" />
  <div class="row">
    <h2>Responses:</h2>
  </div>
  <section class="responses" v-if="loaded && responses.length !== 0">
    <article v-for="response in responses" :key="response._id">
      <ResponseComponent :response="response" @refreshResponses="getResponses(sort, props.topic)" />
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
