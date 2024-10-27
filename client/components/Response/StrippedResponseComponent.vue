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
  <button class="topic" @click="navigateToTopic(props.response.issue)">{{ props.response.issue }}</button>
  <h1>{{ props.response.title }}</h1>
  <p>{{ props.response.content }}</p>
  <div class="base">
    <DisplayLabels :item="props.response" :topicOrResponse="'response'" />
    <div class="upvote-reply">
      <div class="btn-container">
        <button class="reply-btn" @click="navigateToAddResponse(props.response._id)">
          Reply
          <img src="../../assets/images/reply.png" alt="reply" />
        </button>
      </div>
      <UpvotingComponent :responseId="props.response._id" :stripped="true" />
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-size: 1.5em;
  margin-top: 0.3em;
  margin-bottom: 0.3em;
}

p {
  margin: 0em;
}

h1 {
  font-size: 1.5em;
}

.topic {
  padding: 0 0 0 0.1em;
  cursor: pointer;
  background-color: var(--base-bg);
  color: black;
  display: inline-block;
  white-space: nowrap;
  text-align: left;
  width: 30%;
  font-size: 1.1em;
}

.topic:hover {
  color: grey;
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
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.buttons {
  display: flex;
  justify-content: flex-end;
}

.base article:only-child {
  margin-left: auto;
}

.btn-container {
  display: flex;
  align-items: center;
}

.upvote-reply {
  display: flex;
  flex-direction: row;
  gap: 1em;
}

.reply-btn img {
  width: 16px;
  height: 12px;
}
</style>
