import { storeToRefs } from "pinia";
import { createRouter, createWebHistory } from "vue-router";

import { useUserStore } from "@/stores/user";
import AddResponseToResponseView from "../views/AddResponseToResponseView.vue";
import AddResponseToTopicView from "../views/AddResponseToTopicView.vue";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import NonBiasedSamplesView from "../views/NonBiasedSamplesView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import SettingView from "../views/SettingView.vue";
import TopicView from "../views/TopicView.vue";
import UpdateSideView from "../views/UpdateSideView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: "/setting",
      name: "Settings",
      component: SettingView,
      meta: { requiresAuth: true },
    },
    {
      path: "/samples",
      name: "NonBiasedSamples",
      component: NonBiasedSamplesView,
      meta: { requiresAuth: true },
      props: true,
    },
    {
      path: "/topic/:title",
      name: "TopicPage",
      component: TopicView,
      meta: { requiresAuth: true },
      props: true,
    },
    {
      path: "/responseToResponse/:id",
      name: "AddResponseToResponsePage",
      component: AddResponseToResponseView,
      meta: { requiresAuth: true },
      props: true,
    },
    {
      path: "/responseToTopic/:topicTitle",
      name: "AddResponseToTopicPage",
      component: AddResponseToTopicView,
      meta: { requiresAuth: true },
      props: true,
    },
    {
      path: "/updateSide/:topicTitle",
      name: "UpdateSidePage",
      component: UpdateSideView,
      meta: { requiresAuth: true },
      props: true,
    },
    {
      path: "/login",
      name: "Login",
      component: LoginView,
      meta: { requiresAuth: false },
      beforeEnter: (to, from) => {
        const { isLoggedIn } = storeToRefs(useUserStore());
        if (isLoggedIn.value) {
          return { name: "Settings" };
        }
      },
    },
    {
      path: "/:catchAll(.*)",
      name: "not-found",
      component: NotFoundView,
    },
  ],
});

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from) => {
  const { isLoggedIn } = storeToRefs(useUserStore());

  if (to.meta.requiresAuth && !isLoggedIn.value) {
    return { name: "Login" };
  }
});

export default router;
