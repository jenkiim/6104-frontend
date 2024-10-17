<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import CreateResponseForm from "./CreateResponseForm.vue";
import EditResponseForm from "./EditResponseForm.vue";
import ResponseComponent from "./ResponseComponent.vue";

const { isLoggedIn } = storeToRefs(useUserStore());
const props = defineProps(["topic"]);

const loaded = ref(false);
let responses = ref<Array<Record<string, string>>>([]);
let editing = ref("");
// let searchText = ref("");

async function getResponses(topic: string) {
  let query: Record<string, string> = { topic };
  let topicResults;
  try {
    topicResults = await fetchy("/api/responses/topic", "GET", { query });
  } catch (_) {
    return;
  }
  responses.value = topicResults;
}

// function navigateToTopic(title: string) {
//   void router.push({ name: "TopicPage", params: { title: title } });
//   // this.$router.push({ name: "TopicPage", params: { title: this.topic.title } });
// }

function updateEditing(id: string) {
  editing.value = id;
}

onBeforeMount(async () => {
  await getResponses(props.topic);
  loaded.value = true;
});
</script>

<template>
  <div>Filter, Add Response</div>
  <section v-if="isLoggedIn">
    <h2>Respond to this topic!</h2>
    <CreateResponseForm :topic="props.topic" @refreshResponses="getResponses(props.topic)" />
  </section>
  <div class="row">
    <h2>Responses:</h2>
    <!-- <SearchTopicForm @getTopicsByText="getTopics" /> -->
  </div>
  <section class="responses" v-if="loaded && responses.length !== 0">
    <article v-for="response in responses" :key="response._id">
      <!-- <div @click="navigateToTopic(response.title)"> -->
      <!-- <ResponseComponent :response="response" @refreshResponses="getResponses(props.topic)" /> -->
      <ResponseComponent v-if="editing !== response._id" :response="response" @refreshResponses="getResponses(props.topic)" @editResponse="updateEditing" />
      <EditResponseForm v-else :response="response" @refreshResponses="getResponses(props.topic)" @editResponse="updateEditing" />
      <!-- </div> -->
      <!-- <EditResponseForm v-else :response="response" @refreshResponses="getResponses" @editResponse="updateEditing" /> -->
    </article>
  </section>
  <p v-else-if="loaded">No responses found</p>
  <p v-else>Loading...</p>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.responses {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style>
