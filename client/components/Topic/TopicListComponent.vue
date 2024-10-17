<script setup lang="ts">
import CreateTopicForm from "@/components/Topic/CreateTopicForm.vue";
import TopicComponent from "@/components/Topic/TopicComponent.vue";
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import SearchTopicForm from "./SearchTopicForm.vue";

const { isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
let topics = ref<Array<Record<string, string>>>([]);
// let editing = ref("");
let searchText = ref("");

async function getTopics(search?: string) {
  let query: Record<string, string> = search !== undefined ? { search } : {};
  let topicResults;
  try {
    topicResults = await fetchy("/api/topics", "GET", { query });
  } catch (_) {
    return;
  }
  searchText.value = search ? search : "";
  topics.value = topicResults;
}

function navigateToTopic(title: string) {
  void router.push({ name: "TopicPage", params: { title: title } });
  // this.$router.push({ name: "TopicPage", params: { title: this.topic.title } });
}

// function updateEditing(id: string) {
//   editing.value = id;
// }

onBeforeMount(async () => {
  await getTopics();
  loaded.value = true;
});
</script>

<template>
  <section v-if="isLoggedIn">
    <h2>Create a topic:</h2>
    <CreateTopicForm @refreshTopics="getTopics" />
  </section>
  <div class="row">
    <h2 v-if="!searchText">Topics:</h2>
    <h2 v-else>Topics by {{ searchText }}:</h2>
    <SearchTopicForm @getTopicsByText="getTopics" />
  </div>
  <section class="topics" v-if="loaded && topics.length !== 0">
    <article v-for="topic in topics" :key="topic._id">
      <div @click="navigateToTopic(topic.title)">
        <TopicComponent :topic="topic" @refreshTopics="getTopics" />
      </div>
      <!-- <TopicComponent :topic="topic" @refreshTopics="getTopics" /> -->
      <!-- <EditPostForm v-else :post="post" @refreshPosts="getPosts" @editPost="updateEditing" /> -->
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
