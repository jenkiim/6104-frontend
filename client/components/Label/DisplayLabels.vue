<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { defineProps, onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import AddLabelInline from "../Label/AddLabelInline.vue";

const props = defineProps(["item", "topicOrResponse"]);
const labels = ref<string[]>([]);
const showDeleteButton = ref(false);
const { currentUsername } = storeToRefs(useUserStore());

const getLabels = async (title: string, id: string) => {
  let query: Record<string, string> = props.topicOrResponse === "topic" ? { topicTitle: title } : { id };
  let labelResults;
  try {
    labelResults = await fetchy(`/api/label/${props.topicOrResponse}`, "GET", { query });
  } catch (_) {
    return;
  }
  let finalLabels = [];
  for (const labelDoc of labelResults) {
    finalLabels.push(labelDoc.title);
  }
  labels.value = finalLabels;
};

const removeLabel = async (index: number) => {
  const apiUrl = `/api/label/${labels.value[index]}/remove/${props.topicOrResponse}/${props.item.title}`;
  try {
    await fetchy(apiUrl, "PATCH");
  } catch {
    return;
  }
  labels.value.splice(index, 1);
};

onBeforeMount(async () => {
  showDeleteButton.value = currentUsername.value === props.item.author;
  await getLabels(props.item.title, props.item._id);
});
</script>

<template>
  <div class="label-list">
    <span v-for="(label, index) in labels" :key="label" class="label" @click.stop="">
      {{ label }}
      <button v-if="showDeleteButton" @click="removeLabel(index)" class="delete-btn">x</button>
    </span>
    <AddLabelInline v-if="showDeleteButton" :item="props.item" :topicOrResponse="props.topicOrResponse" @updateLabels="getLabels(props.item.title, props.item._id)" @click.stop="" />
  </div>
</template>

<style scoped>
.label-container {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 15px;
  background-color: #f9f9f9;
}

h3 {
  margin-bottom: 10px;
  font-size: 1.5em;
}

.label-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px; /* Space between labels */
}

.label {
  background-color: #007bff; /* Tag background color */
  color: white; /* Text color */
  padding: 8px 12px; /* Padding for labels */
  border-radius: 20px; /* Rounded edges */
  font-size: 0.9em; /* Tag font size */
}
</style>
