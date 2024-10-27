<script setup lang="ts">
import CreateTopicForm from "@/components/Topic/CreateTopicForm.vue";
import TopicComponent from "@/components/Topic/TopicComponent.vue";
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import LabelFilterDropDown from "../Label/LabelFilterDropDown.vue";
import SortDropdown from "../Sorting/SortDropdown.vue";
import SearchTopicForm from "./SearchTopicForm.vue";

const { isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
const topics = ref<Array<Record<string, string>>>([]);
const searchText = ref("");
const sort = ref("newest");
const filters = ref<string[]>([]);

// Function to fetch topics, optionally sorting by a specified criterion
const getTopics = async (sort: string, search?: string, selectedFilters?: string[]) => {
  let query: Record<string, string> = search !== undefined ? { sort, search } : { sort };
  let topicSortResults;
  try {
    topicSortResults = await fetchy("/api/topics/sort", "GET", { query, alert: false });
  } catch (_) {
    return;
  }
  // only include topics that match the selected filters
  if (selectedFilters) {
    let filteredTopics = new Set(topicSortResults.topics.map((topic: Record<string, string>) => topic.title));
    for (const index in selectedFilters) {
      const filter = selectedFilters[index];
      let topicFilterResults = [];
      try {
        topicFilterResults = await fetchy(`/api/topics/label/${filter}`, "GET", { alert: false });
      } catch (_) {
        return;
      }
      const topicFilterResultSet = new Set(topicFilterResults.topics.map((topic: Record<string, string>) => topic.title));
      filteredTopics = new Set([...filteredTopics].filter((topic) => topicFilterResultSet.has(topic)));
    }
    topicSortResults.topics = topicSortResults.topics.filter((topic: Record<string, string>) => filteredTopics.has(topic.title));
  }
  searchText.value = search ? search : "";
  topics.value = topicSortResults.topics;
};

const searchTopics = async (search: string) => {
  await getTopics(sort.value, search, filters.value);
};

const navigateToTopic = (title: string) => {
  void router.push({ name: "TopicPage", params: { title: title } });
};

const handleSortTopics = async (option: string) => {
  sort.value = option;
  await getTopics(option, searchText.value, filters.value);
};

const handleFilterTopics = async (selectedFilters: string[]) => {
  filters.value = selectedFilters;
  await getTopics(sort.value, searchText.value, selectedFilters);
};

onBeforeMount(async () => {
  await getTopics(sort.value);
  loaded.value = true;
});

const options = [
  { display: "Newest ", value: "newest" },
  { display: "Engagement ", value: "engagement" },
  { display: "Random ", value: "random" },
];
</script>

<template>
  <section v-if="isLoggedIn">
    <h2>Create a topic:</h2>
    <CreateTopicForm @refreshTopics="getTopics(sort, undefined, filters)" />
  </section>

  <section class="sort-filter flex-row">
    <SortDropdown @sortItems="handleSortTopics" :sort-options="options" />
    <LabelFilterDropDown @filterItems="handleFilterTopics" :topicOrResponse="'topic'" />
  </section>

  <section class="row">
    <h2 v-if="!searchText">Topics:</h2>
    <h2 v-else>Topics by {{ searchText }}:</h2>
    <SearchTopicForm @getTopicsByText="searchTopics" />
  </section>

  <section class="topics" v-if="loaded && topics.length !== 0">
    <article v-for="topic in topics" :key="topic._id">
      <div class="topic" @click="navigateToTopic(topic.title)">
        <TopicComponent :topic="topic" @refreshTopics="getTopics(sort, undefined, filters)" />
      </div>
    </article>
  </section>
  <p v-else-if="loaded">No posts found</p>
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

.topics {
  padding: 1em;
}

.row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}

.flex-row {
  flex-direction: row;
  margin-top: 1em;
}

article {
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease;
}

article:hover {
  background-color: rgb(204, 204, 204);
  border-color: rgb(204, 204, 204);
}
</style>
