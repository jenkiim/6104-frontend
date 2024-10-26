<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import LabelFilterDropDown from "../Label/LabelFilterDropDown.vue";
import StrippedResponseComponent from "./StrippedResponseComponent.vue";

const { currentUsername } = storeToRefs(useUserStore());
const filters = ref<string[]>([]);
const loaded = ref(false);
let responses = ref<Array<Record<string, string>>>([]);

const getResponses = async (selectedFilters?: string[]) => {
  let responseResults: Record<string, string>[];
  try {
    const apiResponseResults = await fetchy(`/api/responses/topic/random`, "GET");
    responseResults = apiResponseResults.responses;
  } catch (_) {
    return;
  }
  // only include responses that match the selected filters
  if (selectedFilters) {
    if (selectedFilters.length !== 0) {
      let filteredResponses = new Set(responseResults.map((response: Record<string, string>) => response._id.toString()));
      for (const index in selectedFilters) {
        const label = selectedFilters[index];
        let responseFilterResults = [];
        try {
          responseFilterResults = await fetchy(`/api/responses/topic/label/${label}`, "GET");
        } catch (_) {
          return;
        }
        const responseFilterResultSet = new Set(responseFilterResults.responses.map((response: Record<string, string>) => response.title));
        filteredResponses = new Set([...filteredResponses].filter((response) => responseFilterResultSet.has(response)));
      }
      responseResults = responseResults.filter((response: Record<string, string>) => filteredResponses.has(response.title));
    }
  }
  responses.value = responseResults.sort(() => Math.random() - 0.5); // shuffle responses
};

const handleFilterResponses = async (selectedFilters: string[]) => {
  filters.value = selectedFilters;
  await getResponses(selectedFilters);
};

onBeforeMount(async () => {
  await getResponses();
  loaded.value = true;
});
</script>

<template>
  <LabelFilterDropDown @filterItems="handleFilterResponses" :topicOrResponse="'response'" />
  <div class="row">
    <h2>Responses:</h2>
  </div>
  <section class="responses" v-if="loaded && responses.length !== 0">
    <article v-for="response in responses" :key="response._id">
      <div v-if="response.author !== currentUsername" class="strippedResponse">
        <StrippedResponseComponent :response="response" @refreshResponses="getResponses()" />
      </div>
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

.strippedResponse {
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
