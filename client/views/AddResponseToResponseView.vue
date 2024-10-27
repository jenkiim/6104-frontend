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
      <textarea id="content" v-model="content" placeholder="Content" required maxlength="1000"></textarea>
      <div class="base">
        <button type="submit">Respond</button>
      </div>
    </form>
  </main>
</template>

<style scoped>
main {
  padding: 2em 8em;
}
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
