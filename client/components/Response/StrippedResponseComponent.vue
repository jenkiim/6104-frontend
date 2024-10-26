<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import router from "../../router";
import { fetchy } from "../../utils/fetchy";
import DisplayLabels from "../Label/DisplayLabels.vue";
import UpvotingComponent from "../Upvoting/UpvotingComponent.vue";

const props = defineProps(["response"]);
const topic = ref("");

const getTopic = async () => {
  const query = { id: props.response.target };
  let responseResults;
  try {
    responseResults = await fetchy(`/api/topics/byId`, "GET", { query });
  } catch (_) {
    return;
  }
  topic.value = responseResults.title;
};

onBeforeMount(async () => {
  await getTopic();
});

const navigateToAddResponse = async (id: string) => {
  void router.push({ name: "AddResponseToResponsePage", params: { id: id } });
};

const navigateToTopic = (title: string) => {
  void router.push({ name: "TopicPage", params: { title: title } });
};
</script>

<template>
  <button @click="navigateToTopic(props.response.issue)">{{ props.response.issue }}</button>
  <h2>{{ props.response.title }}</h2>
  <p>{{ props.response.content }}</p>
  <div class="base">
    <button class="btn-small pure-button" @click="navigateToAddResponse(props.response._id)">Add Response</button>
    <DisplayLabels :item="props.response" :topicOrResponse="'response'" />
    <UpvotingComponent :responseId="props.response._id" :stripped="true" />
  </div>
</template>

<style scoped>
p {
  margin: 0em;
}

h1 {
  font-size: 1.5em;
}

.author {
  font-size: 1.2em;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}

.base {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.buttons {
  display: flex;
  justify-content: flex-end;
}

.base article:only-child {
  margin-left: auto;
}
</style>
