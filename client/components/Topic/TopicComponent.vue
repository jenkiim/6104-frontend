<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["topic"]);
const emit = defineEmits(["refreshTopics"]);
const { currentUsername } = storeToRefs(useUserStore());

const deleteTopic = async () => {
  try {
    await fetchy(`/api/topic/${props.topic.title}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshTopics");
};
</script>

<template>
  <h1>{{ props.topic.title }}</h1>
  <p class="author">{{ props.topic.author }}</p>
  <div class="base">
    <menu v-if="props.topic.author == currentUsername">
      <!-- <li><button class="btn-small pure-button" @click="emit('editTopic', props.topic._id)">Edit</button></li> -->
      <li><button class="button-error btn-small pure-button" @click="deleteTopic">Delete</button></li>
    </menu>
    <article class="timestamp">
      <!-- <p v-if="props.topic.dateCreated !== props.topic.dateUpdated">Edited on: {{ formatDate(props.topic.dateUpdated) }}</p> -->
      <p>Created on: {{ formatDate(props.topic.dateCreated) }}</p>
    </article>
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
  justify-content: space-between;
  align-items: center;
}

.base article:only-child {
  margin-left: auto;
}
</style>
