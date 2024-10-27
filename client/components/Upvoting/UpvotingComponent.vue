<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { defineProps, onBeforeMount, ref } from "vue";

const props = defineProps(["responseId", "stripped"]);
// const emit = defineEmits(["updateDegree"]);
const vote = ref("");
const count = ref(0);
// State to track the current vote count and whether the user has voted

// Function to handle upvoting
const toggleUpvote = async () => {
  if (vote.value === "upvote") {
    // User clicked upvote again -> Unvote
    count.value--;
    vote.value = "none";
    await changeVote("unvote");
  } else {
    // Upvote the item
    if (vote.value === "downvote") {
      count.value++; // Remove the previous downvote
    }
    count.value++;
    vote.value = "upvote";
    await changeVote("upvote");
  }
};

// Function to handle downvoting
const toggleDownvote = async () => {
  if (vote.value === "downvote") {
    // User clicked downvote again -> Unvote
    count.value++;
    vote.value = "none";
    await changeVote("unvote");
  } else {
    // Downvote the item
    if (vote.value === "upvote") {
      count.value--; // Remove the previous upvote
    }
    count.value--;
    vote.value = "downvote";
    await changeVote("downvote");
  }
};

const changeVote = async (newVote: string) => {
  let apiUrl = `/api/vote/${newVote}/${props.responseId}`;
  try {
    await fetchy(apiUrl, "PATCH");
  } catch (_) {
    return;
  }
};

const getCount = async () => {
  // Fetch the current vote count from the server
  let query: Record<string, string> = { id: props.responseId };
  let currentCount;
  try {
    currentCount = await fetchy("/api/vote/count", "GET", { query });
  } catch (_) {
    return;
  }
  count.value = currentCount;
};

const getVote = async () => {
  // Fetch the current vote count from the server
  let query: Record<string, string> = { id: props.responseId };
  let currentVote;
  try {
    currentVote = await fetchy("/api/vote", "GET", { query });
  } catch (_) {
    return;
  }
  vote.value = currentVote;
};

onBeforeMount(async () => {
  if (!props.stripped) {
    await getCount();
    await getVote();
  }
});
</script>

<template>
  <div class="voting-container">
    <!-- Downvote Button -->
    <button class="arrow downvote" :class="{ active: vote === 'downvote' }" @click="toggleDownvote">▼</button>

    <!-- Display the vote count -->
    <div v-if="!props.stripped" class="vote-count">{{ count }}</div>

    <!-- Upvote Button -->
    <button class="arrow upvote" :class="{ active: vote === 'upvote' }" @click="toggleUpvote">▲</button>
  </div>
</template>

<style scoped>
.voting-container {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  padding: 5px;
  gap: 10px;
}

.arrow {
  background: none;
  border: 1px solid grey;
  border-radius: 5px;
  cursor: pointer;
  color: grey;
  font-size: 24px;
  padding: 8px;
  transition:
    background-color 0.3s,
    color 0.3s;
  min-width: 40px;
}

.arrow.active {
  color: indigo; /* Change color when active */
}

.vote-count {
  font-size: 18px;
  text-align: center; /* Center text */
  min-width: 30px; /* Fixed width for vote count */
}
</style>
