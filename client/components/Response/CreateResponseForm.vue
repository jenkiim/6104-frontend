<script setup lang="ts">
import router from "@/router";
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import AddLabel from "../ResponseLabel/AddLabelComponent.vue";

const props = defineProps(["topic"]);
const content = ref("");
const title = ref("");
const labels = ref<string[]>([]);
const emit = defineEmits(["refreshResponses"]);

const createResponse = async (title: string, content: string) => {
  let newResponse;
  try {
    newResponse = await fetchy(`/api/responses/topic/${props.topic}`, "POST", {
      body: { title, content },
    });
  } catch (_) {
    return;
  }
  for (const label of labels.value) {
    const api = `/api/label/${label}/add/response/${newResponse.response._id}`;
    try {
      await fetchy(api, "PATCH");
    } catch (_) {
      return;
    }
  }
  emit("refreshResponses");
  emptyForm();
  void router.push({ name: "TopicView", params: { id: props.topic } });
};

const emptyForm = () => {
  title.value = "";
  content.value = "";
};

const updateLabels = (selectedLabels: string[]) => {
  labels.value = selectedLabels;
};
</script>

<template>
  <form @submit.prevent="createResponse(title, content)">
    <input id="title" v-model="title" placeholder="Title..." required maxlength="70" />
    <textarea id="content" v-model="content" placeholder="Thoughts!" required maxlength="1000"></textarea>
    <AddLabel @updateLabels="updateLabels" />
    <button type="submit">Respond</button>
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

input {
  font-family: inherit;
  font-size: inherit;
  padding: 0.5em;
  resize: none;
}

#title {
  height: 1em;
}

#content {
  text-wrap: wrap;
}

.required {
  color: rgb(240, 65, 65);
}
</style>
