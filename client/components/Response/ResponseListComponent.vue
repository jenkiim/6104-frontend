<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { computed, onBeforeMount, ref } from "vue";
import LabelFilterDropDown from "../Label/LabelFilterDropDown.vue";
import OpinionDegreeSlider from "../Side/OpinionDegreeSlider.vue";
import SortDropdown from "../Sorting/SortDropdown.vue";
import ResponseComponent from "./ResponseComponent.vue";

const props = defineProps(["topic"]);
const sort = ref("newest");
const filters = ref<string[]>([]);
const degree = ref("");
const sideLeft = ref("");
const sideRight = ref("");
const loaded = ref(false);
let responses = ref<Array<Record<string, string>>>([]);
const sideOptions = ref<Array<Record<string, string>>>([]);
const sidesLoaded = computed(() => sideOptions.value.length > 0);

const sortOptions = [
  { display: "Newest", value: "newest" },
  { display: "Random", value: "random" },
  { display: "Upvotes", value: "upvotes" },
  { display: "Downvotes", value: "downvotes" },
  { display: "Controversial", value: "controversial" },
];

const getResponses = async (topic: string, sort: string, selectedFilters?: string[], degree?: string) => {
  const apiUrl = `/api/responses/topic/${topic}/sort`;
  let query: Record<string, string> = { sort };
  let responseSortResults: Record<string, string>[];
  try {
    const apiResponseSortResults = await fetchy(apiUrl, "GET", { query });
    responseSortResults = apiResponseSortResults.responses;
  } catch (_) {
    return;
  }
  // only include responses that match the selected filters
  if (selectedFilters) {
    let filteredResponses = new Set(responseSortResults.map((response: Record<string, string>) => response.title));
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
    responseSortResults = responseSortResults.filter((response: Record<string, string>) => filteredResponses.has(response.title));
  }
  if (degree) {
    const idsToInclude = new Set();
    for (const response of responseSortResults) {
      try {
        const responseDegree = await fetchy(`/api/responses/response/${response._id}/degree`, "GET");
        if (responseDegree.side === degree) {
          idsToInclude.add(response._id.toString());
        }
      } catch (_) {
        return;
      }
    }
    responseSortResults = responseSortResults.filter((response: Record<string, string>) => idsToInclude.has(response._id.toString()));
  }
  responses.value = responseSortResults;
};

const handleSortResponses = async (option: string) => {
  sort.value = option;
  await getResponses(props.topic, option, filters.value, degree.value);
};

const handleFilterResponses = async (selectedFilters: string[]) => {
  filters.value = selectedFilters;
  await getResponses(props.topic, sort.value, selectedFilters, degree.value);
};

const handleDegree = async (newDegree: string) => {
  degree.value = newDegree;
  await getResponses(props.topic, sort.value, filters.value, newDegree);
};

onBeforeMount(async () => {
  await getResponses(props.topic, sort.value);
  loaded.value = true;
  const regex = /(.+)\s+vs\.\s+(.+)/i;
  const match = props.topic.match(regex);
  sideLeft.value = match[1].trim();
  sideRight.value = match[2].trim();
  sideOptions.value = [
    { display: `Strongly Prefer ${sideLeft.value}`, value: "Strongly Disagree" },
    { display: `Prefer ${sideLeft.value}`, value: "Disagree" },
    { display: `Slightly Prefer ${sideLeft.value}`, value: "Slightly Disagree" },
    { display: "Neutral", value: "Neutral" },
    { display: `Slightly Prefer ${sideRight.value}`, value: "Slightly Agree" },
    { display: `Prefer ${sideRight.value}`, value: "Agree" },
    { display: `Strongly Prefer ${sideRight.value}`, value: "Strongly Agree" },
    { display: "Undecided", value: "Undecided" },
  ];
});
</script>

<template>
  <div v-if="sidesLoaded">
    <OpinionDegreeSlider :sideLeft="sideLeft" :sideRight="sideRight" :addOrFilter="'filter'" :options="sideOptions" @updateDegree="handleDegree" />
  </div>
  <LabelFilterDropDown @filterItems="handleFilterResponses" :topicOrResponse="'response'" />
  <SortDropdown :sortOptions="sortOptions" @sortItems="handleSortResponses" />
  <div class="row">
    <h2>Responses:</h2>
  </div>
  <section class="responses" v-if="loaded && responses.length !== 0">
    <article v-for="response in responses" :key="response._id">
      <ResponseComponent :response="response" @refreshResponses="getResponses(props.topic, sort)" />
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
