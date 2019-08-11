<template>
  <div>
    <nav class="navbar docs-navbar is-spaced has-shadow">
      <img alt="Passionfruit" src="../assets/logo.svg" width="240" />
    </nav>
    <div class="content">
      <h1>Select an app</h1>
    </div>
  </div>
</template>

<script lang="ts">
import { Route } from "vue-router";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { AppInfo } from "@/types";
import Icon from "@/components/Icon.vue";

@Component({
  components: {
    Icon
  }
})
export default class AppSelector extends Vue {
  private apps!: AppInfo[];

  @Watch("$route", { immediate: true })
  private async changeRouter(route: Route) {
    const apps = await fetch(`/api/device/${route.params.device}/apps`).then(
      r => r.json()
    );
    this.apps = apps;
  }
}
</script>
