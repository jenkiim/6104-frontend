<script setup lang="ts">
import SampleResponsesList from "@/components/Response/SampleResponsesList.vue";
// import router from "@/router";
// import { useUserStore } from "@/stores/user";
// import { storeToRefs } from "pinia";

// const { isLoggedIn } = storeToRefs(useUserStore());

// const props = defineProps(["title"]);
// const loaded = ref(false);
// const topicObject = ref<Record<string, string>>({});

// const navigateToUpdateSide = () => {
//   void router.push({ name: "UpdateSidePage", params: { topicTitle: props.title } });
// };

// const navigateToResponse = () => {
//   void router.push({ name: "AddResponseToTopicPage", params: { topicTitle: props.title } });
// };
</script>

<template>
  <main>
    <h1>Non-Biased Samples Page</h1>
    <p class="page-description">
      Here you'll find random responses people have made to various topics! The best part is that all of the details are stripped away allowing you to read opinions without any bias.
    </p>
    <!-- add filter thing and reshuffle -->
    <SampleResponsesList />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}

p {
  padding: 2em;
}
</style>
