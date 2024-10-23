<script setup lang="ts">
import CreateResponseForm from "@/components/Response/CreateResponseForm.vue";
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { isLoggedIn } = storeToRefs(useUserStore());

const props = defineProps(["topicTitle"]);
// const title = ref("");
// const content = ref("");
const emit = defineEmits(["refreshResponses"]);

// const addResponse = async (title: string, content: string) => {
//   try {
//     await fetchy(`/api/responses/response/${props.id}`, "POST", { body: { title: title, content: content } });
//   } catch (e) {
//     return;
//   }
//   emit("refreshResponses");
//   // void router.push({ name: "TopicView", params: { id: props.id } }); //////// will error if the target isn't a topic
//   router.go(-1);
// };

// const emptyForm = () => {
//   title.value = "";
//   content.value = "";
// };

const addResponse = () => {
  emit("refreshResponses");
  router.go(-1);
};

const navigateToUpdateSide = () => {
  void router.push({ name: "UpdateSidePage", params: { topicTitle: props.topicTitle } });
};
</script>

<template>
  <section v-if="isLoggedIn">
    <h2>Want to update your response?</h2>
    <button @click="navigateToUpdateSide">Update Side</button>
    <h2>Respond to this topic!</h2>
    <CreateResponseForm :topic="props.topicTitle" @refreshResponses="addResponse" />
  </section>
  <section v-else>
    <p>You must be logged in to respond to this topic.</p>
  </section>
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
