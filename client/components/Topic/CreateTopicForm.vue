<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const description = ref("");
const title = ref("");
const emit = defineEmits(["refreshTopics"]);

const createTopic = async (title: string, description: string) => {
  try {
    await fetchy("/api/topic", "POST", {
      body: { title, description },
    });
  } catch (_) {
    return;
  }
  emit("refreshTopics");
  emptyForm();
};

const emptyForm = () => {
  title.value = "";
  description.value = "";
};
</script>

<template>
  <form @submit.prevent="createTopic(title, description)">
    <label for="title">Topic Contents: <span class="required">**Must be in the format X vs. Y**</span></label>
    <input id="title" v-model="title" placeholder="Create a topic! Format: X vs. Y" required pattern=".+\s+vs\.\s+.+" title="Please enter in the format: X vs. Y" />
    <textarea id="description" v-model="description" placeholder="What is the description of your topic?" required> </textarea>
    <button type="submit" class="pure-button-primary pure-button">Create Topic</button>
  </form>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
}

#title {
  height: 1em;
}

#description {
  height: 4em;
}

.required {
  color: rgb(240, 65, 65);
}
</style>
