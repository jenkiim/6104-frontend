<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import { formatDate } from "../../utils/formatDate";

const props = defineProps(["response"]);
const title = ref(props.response.title);
const emit = defineEmits(["editResponse", "refreshResponses"]);

const editResponse = async (title: string) => {
  try {
    await fetchy(`/api/responses/topic/${props.response._id}/title`, "PATCH", { body: { title: title } });
  } catch (e) {
    return;
  }
  emit("editResponse");
  emit("refreshResponses");
};
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
</style>
