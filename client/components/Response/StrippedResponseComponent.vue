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
const topic = ref("");

const deleteResponse = async () => {
  try {
    await fetchy(`/api/responses/topic/${props.response._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshResponses");
};

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

function navigateToAddResponse(id: string) {
  void router.push({ name: "AddResponseToResponsePage", params: { id: id } });
}
</script>

<template>
  <h1>{{ topic }}</h1>
  <h2>{{ props.response.title }}</h2>
  <p>{{ props.response.content }}</p>
  <div class="base">
    <button class="btn-small pure-button" @click="navigateToAddResponse(props.response._id)">Add Response</button>
    <DisplayLabels :item="props.response" :topicOrResponse="'response'" />
    <menu class="buttons" v-if="props.response.author == currentUsername">
      <li><button class="button-error btn-small pure-button" @click="deleteResponse">Delete</button></li>
    </menu>
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
