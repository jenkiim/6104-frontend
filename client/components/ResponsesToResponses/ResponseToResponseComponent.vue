<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import UpvotingComponent from "../Upvoting/UpvotingComponent.vue";

const props = defineProps(["response"]);
const emit = defineEmits(["refreshResponses"]);
const { currentUsername } = storeToRefs(useUserStore());
let responses = ref<Array<Record<string, string>>>([]);

const deleteResponse = async () => {
  try {
    await fetchy(`/api/responses/response/${props.response._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshResponses");
};

async function getResponses(targetId: string) {
  let query: Record<string, string> = targetId !== undefined ? { targetId } : {};
  let responseResults;
  try {
    responseResults = await fetchy("/api/responses/response", "GET", { query });
  } catch (_) {
    return;
  }
  responses.value = responseResults;
}

onBeforeMount(async () => {
  await getResponses(props.response._id);
});

function navigateToAddResponse(id: string) {
  void router.push({ name: "AddResponseToResponsePage", params: { id: id } });
}
</script>

<template>
  <div class="repsonseToResponse">
    <h3 class="author">@{{ props.response.author }}</h3>
    <h1>{{ props.response.title }}</h1>
    <p>{{ props.response.content }}</p>
    <div class="base">
      <button class="reply-btn" @click="navigateToAddResponse(props.response._id)">
        Reply
        <img src="../../assets/images/reply.png" alt="reply" />
      </button>
      <UpvotingComponent :responseId="props.response._id" />
    </div>
    <div class="delete-btn-container" v-if="props.response.author == currentUsername">
      <button class="button-error btn-small pure-button" @click="deleteResponse">Delete</button>
    </div>
    <section class="responses" v-if="responses.length !== 0">
      <article v-for="response in responses" :key="response._id">
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
  justify-content: flex-end;
  align-items: center;
  gap: 1em;
}

.base article:only-child {
  margin-left: auto;
}

.repsonseToResponse {
  border-top: 1px solid rgb(117, 117, 117);
  padding-top: 1em;
  padding-left: 2em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

.delete-btn-container {
  display: flex;
  justify-content: flex-end;
}

.reply-btn img {
  width: 16px;
  height: 12px;
}
</style>
