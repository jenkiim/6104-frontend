<!-- <script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import { formatDate } from "../../utils/formatDate";
import ResponseToResponseComponent from "../ResponsesToResponses/ResponseToResponseComponent.vue";

const props = defineProps(["response"]);
const title = ref(props.response.title);
const emit = defineEmits(["editResponse", "refreshResponses"]);
const responsesToCurrent = ref<Array<Record<string, string>>>([]);

const editResponse = async (title: string) => {
  try {
    await fetchy(`/api/responses/topic/${props.response._id}/title`, "PATCH", { body: { title: title } });
  } catch (e) {
    return;
  }
  emit("editResponse");
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
  console.log("responseResults", responseResults);
  responsesToCurrent.value = responseResults;
};

onBeforeMount(async () => {
  console.log("props.response._id", props.response._id);
  await getResponses(props.response._id);
});
</script>

<template>
  <form @submit.prevent="editResponse(title)">
    <p class="author">{{ props.response.author }}</p>
    <textarea id="content" v-model="title" placeholder="New title..." required> </textarea>
    <div class="base">
      <menu>
        <li><button class="btn-small pure-button-primary pure-button" type="submit">Save</button></li>
        <li><button class="btn-small pure-button" @click="emit('editResponse')">Cancel</button></li>
      </menu>
      <p v-if="props.response.dateCreated !== props.response.dateUpdated" class="timestamp">Edited on: {{ formatDate(props.response.dateUpdated) }}</p>
      <p v-else class="timestamp">Created on: {{ formatDate(props.response.dateCreated) }}</p>
    </div>
  </form>
  <section class="responses" v-if="responsesToCurrent.length !== 0">
    <article v-for="response in responsesToCurrent" :key="response._id">
      <ResponseToResponseComponent :response="response" @refreshResponses="getResponses(props.response._id)" />
      @editResponse="updateEditing"
      <TopicComponent :topic="topic" @refreshTopics="getTopics" />
      <EditPostForm v-else :post="post" @refreshPosts="getPosts" @editPost="updateEditing" />
    </article>
  </section>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  border-radius: 4px;
  resize: none;
}

p {
  margin: 0em;
}

.author {
  font-weight: bold;
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

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}
</style> -->
