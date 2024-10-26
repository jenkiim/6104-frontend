<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import router from "../../router";
import { fetchy } from "../../utils/fetchy";
import DisplayLabels from "../Label/DisplayLabels.vue";
import ResponseToResponseComponent from "../ResponsesToResponses/ResponseToResponseComponent.vue";
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

function navigateToAddResponse(id: string) {
  void router.push({ name: "AddResponseToResponsePage", params: { id: id } });
}
</script>

<template>
  <h1>{{ props.response.title }}</h1>
  <p class="author">{{ props.response.author }}</p>
  <p>{{ props.response.content }}</p>
  <div class="base">
    <button class="btn-small pure-button" @click="navigateToAddResponse(props.response._id)">Add Response</button>
    <div class="response-attributes">
      <DisplayLabels :item="props.response" :topicOrResponse="'response'" />
      <menu class="buttons" v-if="props.response.author == currentUsername">
        <li><button class="button-error btn-small pure-button" @click="deleteResponse">Delete</button></li>
      </menu>
    </div>
    <div class="upvoting-container">
      <UpvotingComponent :responseId="props.response._id" />
    </div>
    <section class="responses" v-if="responsesToCurrent.length !== 0">
      <article v-for="response in responsesToCurrent" :key="response._id">
        <ResponseToResponseComponent :response="response" @refreshResponses="getResponses(props.response._id)" />
      </article>
    </section>
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

.upvoting-container {
  width: 10%;
}

.response-attributes {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
