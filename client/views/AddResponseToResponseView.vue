<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { fetchy } from "../utils/fetchy";

const { isLoggedIn } = storeToRefs(useUserStore());

const props = defineProps(["id"]);
const title = ref("");
const content = ref("");
const emit = defineEmits(["addResponse", "refreshResponses"]);

const addResponse = async (title: string, content: string) => {
  try {
    await fetchy(`/api/responses/response/${props.id}`, "POST", { body: { title: title, content: content } });
  } catch (e) {
    return;
  }
  emit("refreshResponses");
  emptyForm();
  router.go(-1);
};

const emptyForm = () => {
  title.value = "";
  content.value = "";
};
</script>

<template>
  <main v-if="isLoggedIn">
    <h1>Write a response!</h1>
    <form @submit.prevent="addResponse(title, content)">
      <input id="content" v-model="title" placeholder="Title" required maxlength="70" />
      <input id="content" v-model="content" placeholder="Content" required maxlength="200" />
      <div class="base">
        <menu>
          <li><button class="btn-small pure-button-primary pure-button" type="submit">Respond</button></li>
        </menu>
      </div>
    </form>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}

p {
  padding: 2em;
}

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
