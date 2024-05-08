import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "@/views/home/Home.vue";
import { beforeEachRouteAction, checkForDocument, fetchViewDocument } from "@/router/actions";

export const ROUTE_NAMES = {
  home: "Home",
  edit: "Edit",
  view: "View",
  library: "Library",
  profile: "Profile",
  thanks: "Thanks",
  register: "Registration",
  passwordReset: "PasswordReset"
};

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: ROUTE_NAMES.home,
    component: Home,
  },
  {
    path: "/edit",
    name: ROUTE_NAMES.edit,
    component: () => import("@/views/edit/Edit.vue"),
    beforeEnter: checkForDocument,
  },
  {
    path: "/view/:user/:name",
    name: ROUTE_NAMES.view,
    component: () => import("@/views/view/View.vue"),
    props: true,
    beforeEnter: fetchViewDocument
  },
  {
    path: "/library",
    name: ROUTE_NAMES.library,
    component: () => import("@/views/library/Library.vue"),
    meta: {
      title: {
        messageKey: "global.routes.library",
      },
    },
  },
  {
    path: "/registration",
    name: ROUTE_NAMES.register,
    component: () => import("@/views/registration/Registration.vue"),
    beforeEnter: (to, from, next) => {
      if (!to.query.token) {
        next({ name: ROUTE_NAMES.home })
      }
      next();
    }
  },
  {
    path: "/profile",
    name: ROUTE_NAMES.profile,
    component: () => import("@/views/profile/Profile.vue"),
    meta: {
      onlyAuthenticated: true
    }
  },
  {
    path: "/thanks",
    name: ROUTE_NAMES.thanks,
    component: () => import("@/views/thanks/Thanks.vue")
  },
  {
    path: "/passwordReset",
    name: ROUTE_NAMES.passwordReset,
    component: () => import("@/views/password-reset/PasswordReset.vue")
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: {
      name: ROUTE_NAMES.home
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(beforeEachRouteAction);

export default router;
