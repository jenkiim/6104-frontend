<script setup lang="ts">
import CreateTopicForm from "@/components/Topic/CreateTopicForm.vue";
import TopicComponent from "@/components/Topic/TopicComponent.vue";
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import SortDropdown from "../Sorting/SortDropdown.vue";
import SearchTopicForm from "./SearchTopicForm.vue";

const { isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
const topics = ref<Array<Record<string, string>>>([]);
const searchText = ref("");
const sort = ref("newest");

// Function to fetch topics, optionally sorting by a specified criterion
const getTopics = async (sort: string, search?: string) => {
  // /responses/topic/:topicid/sort     sort
  let query: Record<string, string> = search !== undefined ? { sort, search } : { sort };
  let topicResults;
  try {
    topicResults = await fetchy("/api/topics/sort", "GET", { query });
  } catch (_) {
    return;
  }
  searchText.value = search ? search : "";
  topics.value = topicResults.topics;
};

const searchTopics = async (search: string) => {
  await getTopics(sort.value, search);
};

const navigateToTopic = (title: string) => {
  void router.push({ name: "TopicPage", params: { title: title } });
};

const handleSortTopics = async (option: string) => {
  sort.value = option;
  await getTopics(option, searchText.value);
};

onBeforeMount(async () => {
  await getTopics(sort.value);
  loaded.value = true;
});

const options = [
  { display: "Newest", value: "newest" },
  { display: "Engagement", value: "engagement" },
  { display: "Random", value: "random" },
];
</script>

<template>
  <section v-if="isLoggedIn">
    <h2>Create a topic:</h2>
    <CreateTopicForm @refreshTopics="getTopics" />
  </section>

  <!-- Sort topics using the dropdown -->
  <SortDropdown @sortItems="handleSortTopics" :sort-options="options" />

  <div class="row">
    <h2 v-if="!searchText">Topics:</h2>
    <h2 v-else>Topics by {{ searchText }}:</h2>
    <SearchTopicForm @getTopicsByText="searchTopics" />
  </div>

  <section class="topics" v-if="loaded && topics.length !== 0">
    <article v-for="topic in topics" :key="topic._id">
      <div @click="navigateToTopic(topic.title)">
        <TopicComponent :topic="topic" @refreshTopics="getTopics" />
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
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style>
