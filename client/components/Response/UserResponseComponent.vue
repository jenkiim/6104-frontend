<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import router from "../../router";
import { fetchy } from "../../utils/fetchy";
import DisplayLabels from "../Label/DisplayLabels.vue";
import UpvotingComponent from "../Upvoting/UpvotingComponent.vue";

const props = defineProps(["response"]);
const emit = defineEmits(["refreshResponses"]);
const { currentUsername } = storeToRefs(useUserStore());
const responsesToCurrent = ref<Array<Record<string, string>>>([]);

const deleteResponse = async () => {
  try {
    await fetchy(`/api/responses/topic/${props.response._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshResponses");
};

const getResponses = async (targetId: string) => {
  let query: Record<string, string> = targetId !== undefined ? { targetId } : {};
  let responseResults;
  try {
    responseResults = await fetchy("/api/responses/response", "GET", { query });
  } catch (_) {
    return;
  }
  responsesToCurrent.value = responseResults;
};

onBeforeMount(async () => {
  await getResponses(props.response._id);
});

const navigateToTopic = (title: string) => {
  void router.push({ name: "TopicPage", params: { title: title } });
};
</script>

<template>
  <button class="topic" @click="navigateToTopic(props.response.issue)">{{ props.response.issue }}</button>
  <h1>{{ props.response.title }}</h1>
  <p>{{ props.response.content }}</p>
  <div class="base">
    <section class="response">
      <div class="response-attributes">
        <DisplayLabels :item="props.response" :topicOrResponse="'response'" />
        <UpvotingComponent :responseId="props.response._id" />
      </div>
      <menu class="buttons" v-if="props.response.author == currentUsername">
        <button class="button-error btn-small pure-button" @click="deleteResponse">Delete</button>
      </menu>
    </section>
  </div>
</template>

<style scoped>
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

p {
  margin: 0em;
}

h1 {
  font-size: 1.5em;
  margin-top: 0.3em;
  margin-bottom: 0.3em;
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
  gap: 0.7em;
}

.buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5em;
}

.base article:only-child {
  margin-left: auto;
}

.upvoting-container {
  width: 10%;
}

.response-attributes {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.upvote-reply {
  display: flex;
  flex-direction: row;
  gap: 1em;
}

.response {
  padding-bottom: 0.5em;
}

.btn-container {
  display: flex;
  align-items: center;
}

.btn-container img {
  width: 16px;
  height: 12px;
}
</style>
