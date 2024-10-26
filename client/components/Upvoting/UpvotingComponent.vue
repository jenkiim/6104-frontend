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
    vote.value = "unvote";
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
  await getCount();
  await getVote();
});
</script>

<template>
  <div class="voting-container">
    <!-- Upvote Button -->
    <button :class="{ active: vote === 'upvote' }" @click="toggleUpvote">▲</button>

    <!-- Display the vote count -->
    <div v-if="!props.stripped" class="vote-count">{{ count }}</div>

    <!-- Downvote Button -->
    <button :class="{ active: vote === 'downvote' }" @click="toggleDownvote">▼</button>
  </div>
</template>

<style scoped>
.voting-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  padding: 5px;
}

button.active {
  color: green; /* Change to indicate active upvote */
}

button.active + .vote-count {
  color: green;
}

.vote-count {
  font-size: 18px;
  margin: 10px 0;
}
</style>
