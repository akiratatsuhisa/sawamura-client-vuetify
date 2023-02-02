export {};

import "vue-router";

declare module "vue-router" {
  interface RouteMeta {
    requiresAuth?: boolean;
    requiresRoles?: Array<string>;
  }
}
