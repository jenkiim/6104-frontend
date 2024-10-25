<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
import LabelFilterDropDown from "../Label/LabelFilterDropDown.vue";
import SortDropdown from "../Sorting/SortDropdown.vue";
import ResponseComponent from "./ResponseComponent.vue";

// const { isLoggedIn } = storeToRefs(useUserStore());
const props = defineProps(["topic"]);
const sort = ref("newest");
const filters = ref<string[]>([]);

const loaded = ref(false);
let responses = ref<Array<Record<string, string>>>([]);

const getResponses = async (topic: string, sort: string, selectedFilters?: string[]) => {
  const apiUrl = `/api/responses/topic/${topic}/sort`;
  let query: Record<string, string> = { sort };
  let responseSortResults;
  try {
    responseSortResults = await fetchy(apiUrl, "GET", { query });
  } catch (_) {
    return;
  }
  // only include responses that match the selected filters
  if (selectedFilters) {
    let filteredResponses = new Set(responseSortResults.responses.map((response: Record<string, string>) => response.title));
    for (const index in selectedFilters) {
      const filter = selectedFilters[index];
      let responseFilterResults = [];
      try {
        responseFilterResults = await fetchy(`/api/responses/topic/${topic}/label/${filter}`, "GET");
      } catch (_) {
        return;
      }
      const responseFilterResultSet = new Set(responseFilterResults.responses.map((response: Record<string, string>) => response.title));
      filteredResponses = new Set([...filteredResponses].filter((response) => responseFilterResultSet.has(response)));
    }
    responseSortResults.responses = responseSortResults.responses.filter((response: Record<string, string>) => filteredResponses.has(response.title));
  }
  responses.value = responseSortResults.responses;
};

const handleSortResponses = async (option: string) => {
  sort.value = option;
  await getResponses(props.topic, option, filters.value);
};

const handleFilterResponses = async (selectedFilters: string[]) => {
  filters.value = selectedFilters;
  await getResponses(props.topic, sort.value, selectedFilters);
};

onBeforeMount(async () => {
  await getResponses(props.topic, sort.value);
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
  <LabelFilterDropDown @filterItems="handleFilterResponses" :topicOrResponse="'response'" />
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
