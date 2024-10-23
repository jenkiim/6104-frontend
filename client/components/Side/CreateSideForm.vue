<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import OpinionDegreeSlider from "./OpinionDegreeSlider.vue";

const props = defineProps(["topicTitle"]);
const degree = ref("");
const sideLeft = ref("");
const sideRight = ref("");

/// set the sides of the topic
onBeforeMount(() => {
  sideLeft.value = props.topicTitle.split(" vs. ")[0];
  sideRight.value = props.topicTitle.split(" vs. ")[1];
});
////////// TODO: check if sides are undefined
// console.log(sideLeft.value);
// console.log(sideRight.value);
// if (sideLeft.value === undefined || sideRight.value === undefined) {
//   console.log("Topic not in correct format (X vs. Y)");
//   throw new Error("Topic not in correct format (X vs. Y)");
// }

const createSide = async (topicTitle: string, degree: string) => {
  try {
    const apiLink = `/api/side/${topicTitle}`;
    await fetchy(apiLink, "POST", {
      body: { degree },
    });
  } catch (_) {
    return;
  }
  emptyForm();
};

const setDegreeUndecided = () => {
  degree.value = "undecided";
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
    <OpinionDegreeSlider :sideLeft="sideLeft" :sideRight="sideRight" @updateDegree="setDegree"></OpinionDegreeSlider>
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
