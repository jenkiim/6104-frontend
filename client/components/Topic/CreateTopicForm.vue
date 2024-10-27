<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import AddLabelNewForm from "../Label/AddLabelNewForm.vue";

const description = ref("");
const title = ref("");
const labels = ref<string[]>([]);
const emit = defineEmits(["refreshTopics"]);

const createTopic = async (title: string, description: string) => {
  try {
    await fetchy("/api/topic", "POST", {
      body: { title, description },
    });
  } catch (_) {
    return;
  }
  // add all selected labels to topic
  try {
    const promises = labels.value.map((label) => fetchy(`/api/label/${label}/add/topic/${title}`, "PATCH"));
    await Promise.all(promises);
  } catch (_) {
    return;
  }
  emit("refreshTopics");
  emptyForm();
};

const removeLabel = (index: number) => {
  labels.value.splice(index, 1);
};

const updateLabels = (selectedLabels: string[]) => {
  labels.value = selectedLabels;
};

const emptyForm = () => {
  title.value = "";
  description.value = "";
  labels.value = [];
};
</script>

<template>
  <form @submit.prevent="createTopic(title, description)">
    <label for="title">Topic Contents: <span class="required">**Must be in the format X vs. Y**</span></label>
    <input id="title" v-model="title" placeholder="Create a topic! Format: X vs. Y" required pattern="\S+.*\S*\s+vs\.\s+\S+.*\S*" title="Please enter in the format: X vs. Y" maxlength="70" />
    <textarea id="description" v-model="description" placeholder="What is the description of your topic?" required maxlength="1000"> </textarea>
    <span v-for="(label, index) in labels" :key="label" class="label">
      {{ label }}
      <button @click="removeLabel(index)" class="delete-btn">x</button>
    </span>
    <AddLabelNewForm :topicOrResponse="'topic'" @update-labels="updateLabels" />
    <button type="submit">Create Topic</button>
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

.delete-btn {
  padding: 0 0.5em;
  background-color: var(--signature-slightly-lighter);
}

.delete-btn:hover {
  background-color: var(--signature-light);
}
</style>
