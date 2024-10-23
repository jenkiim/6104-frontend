<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["topic"]);
const content = ref("");
const title = ref("");
const emit = defineEmits(["refreshResponses"]);

const createResponse = async (title: string, content: string) => {
  try {
    await fetchy(`/api/responses/topic/${props.topic}`, "POST", {
      body: { title, content },
    });
  } catch (_) {
    return;
  }
  emit("refreshResponses");
  emptyForm();
};

const emptyForm = () => {
  title.value = "";
  content.value = "";
};
</script>

<template>
  <form @submit.prevent="createResponse(title, content)">
    <textarea id="title" v-model="title" placeholder="Title..." required> </textarea>
    <textarea id="content" v-model="content" placeholder="Thoughts!" required> </textarea>
    <button type="submit" class="pure-button-primary pure-button">Respond</button>
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

#content {
  height: 4em;
}

.required {
  color: rgb(240, 65, 65);
}
</style>
