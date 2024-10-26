<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";
import DisplayLabels from "../Label/DisplayLabels.vue";

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
  <div class="topic-container">
    <h1>{{ props.topic.title }}</h1>
    <p class="author">{{ props.topic.author }}</p>
    <div class="base">
      <DisplayLabels :item="props.topic" :topicOrResponse="'topic'" />
      <menu v-if="props.topic.author == currentUsername">
        <li><button class="button-error btn-small pure-button" @click="deleteTopic" @click.stop="">Delete</button></li>
      </menu>
    </div>
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

.topic-container {
  display: flex;
  flex-direction: column;
  gap: 1em;
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
