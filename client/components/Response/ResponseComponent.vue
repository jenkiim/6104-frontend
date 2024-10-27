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

function navigateToUserPage(username: string) {
  void router.push({ name: "User", params: { username: username } });
}
</script>

<template>
  <button class="author" @click="navigateToUserPage(props.response.author)">@{{ props.response.author }}</button>
  <!-- <h3 class="author">@{{ props.response.author }}</h3> -->
  <h1>{{ props.response.title }}</h1>
  <p>{{ props.response.content }}</p>
  <div class="base">
    <section class="response">
      <div class="response-attributes">
        <DisplayLabels :item="props.response" :topicOrResponse="'response'" />
        <div class="upvote-reply">
          <div class="btn-container">
            <button class="reply-btn" @click="navigateToAddResponse(props.response._id)">
              Reply
              <img src="../../assets/images/reply.png" alt="reply" />
            </button>
          </div>
          <UpvotingComponent :responseId="props.response._id" />
        </div>
      </div>
      <menu class="buttons" v-if="props.response.author == currentUsername">
        <li><button class="button-error btn-small pure-button" @click="deleteResponse">Delete</button></li>
      </menu>
    </section>
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
  margin-top: 0.3em;
  margin-bottom: 0.3em;
}

.author {
  font-size: 1.2em;
  font-weight: 500;
  font-style: italic;
  margin: 0;
  display: block;
  margin-block-start: 0.5em;
  margin-block-end: 0em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  unicode-bidi: isolate;
  background-color: var(--base-bg);
  color: black;
  padding: 0;
  align-self: flex-start;
}

.author:hover {
  color: grey;
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
