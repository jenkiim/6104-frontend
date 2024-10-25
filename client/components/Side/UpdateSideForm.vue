<script setup lang="ts">
import router from "@/router";
import { computed, onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import OpinionDegreeSlider from "./OpinionDegreeSlider.vue";

const props = defineProps(["topicTitle"]);
const degree = ref("");
const sideLeft = ref("");
const sideRight = ref("");
const sideOptions = ref<Array<Record<string, string>>>([]);
const sidesLoaded = computed(() => sideOptions.value.length > 0);

/// set the sides of the topic
onBeforeMount(() => {
  const regex = /(.+)\s+vs\.\s+(.+)/i;
  const match = props.topicTitle.match(regex);
  sideLeft.value = match[1].trim();
  sideRight.value = match[2].trim();
  sideOptions.value = [
    { display: `Strongly Prefer ${sideLeft.value}`, value: "Strongly Disagree" },
    { display: `Prefer ${sideLeft.value}`, value: "Disagree" },
    { display: `Slightly Prefer ${sideLeft.value}`, value: "Slightly Disagree" },
    { display: "Neutral", value: "Neutral" },
    { display: `Slightly Prefer ${sideRight.value}`, value: "Slightly Agree" },
    { display: `Prefer ${sideRight.value}`, value: "Agree" },
    { display: `Strongly Prefer ${sideRight.value}`, value: "Strongly Agree" },
  ];
});

const createSide = async (topicTitle: string, newside: string) => {
  try {
    const apiLink = `/api/side/${topicTitle}`;
    await fetchy(apiLink, "PATCH", {
      body: { newside },
    });
  } catch (_) {
    return;
  }
  emptyForm();
  router.go(-1);
};

const setDegreeUndecided = () => {
  degree.value = "Undecided";
};

const setDegree = (newDegree: string) => {
  degree.value = newDegree;
};

const emptyForm = () => {
  degree.value = "";
};
</script>

<template>
  <form @submit.prevent="createSide(props.topicTitle, degree)">
    <h1>What side are you on?</h1>
    <h2>{{ props.topicTitle }}</h2>
    <div v-if="sidesLoaded">
      <OpinionDegreeSlider :sideLeft="sideLeft" :sideRight="sideRight" @updateDegree="setDegree" :addOrFilter="'add'" :options="sideOptions" />
    </div>
    <button type="submit" class="pure-button-primary pure-button">Decided!</button>
    <h2>Undecided? Click here!</h2>
    <button type="submit" class="pure-button-primary pure-button" @click="setDegreeUndecided()">Undecided!</button>
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
