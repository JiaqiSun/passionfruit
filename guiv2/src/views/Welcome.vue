<template>
  <div id="app">
    <section class="hero is-fullheight">
      <div class="hero-body">
        <div class="container">
          <img alt="Passionfruit" src="../assets/logo.svg" width="300" />
          <p>
            Web based iOS App Analyzer, powered by
            <a href="https://frida.re">frida.re</a>, created by
            <a href="https://twitter.com/codecolorist">@CodeColorist</a>
          </p>

          <section class="select-device">
            <p class="panel-title">
              Target Device
              <!-- <b-button @click="add">
                <b-tooltip label="Connect via TCP">
                  <b-icon icon="plus-circle-outline" size="is-middle" title="Connect via TCP"></b-icon>
                </b-tooltip>
              </b-button> -->
            </p>

            <ul class="devices">
              <li v-for="dev in devices" :key="dev.id">
                <router-link :to="{ name: 'apps', params: { device: dev.id } }">
                  <h3 class="device-name">
                    <Icon :icon="dev.icon" :width="24" :height="24" />
                    {{ dev.name }}
                    <b-icon :icon="dev.type" size="is-small"></b-icon>
                  </h3>
                  <code>{{ dev.id }}</code>
                </router-link>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="stylus">
.select-device {
  margin-top: 2rem;

  .panel-title {
    font-size: 1.25em;
    font-weight: 600;
    line-height: 2em;
  }

  .device-name {
    font-weight: 600;
  }
}

ul.devices {
  list-style: none;
  margin: 1rem 0 2rem 0;

  li {
    border: 1px solid #ffffff42;
    border-radius: 4px;
    display: inline-block;
    width: 360px;
    height: 80px;
    margin: 0 1rem 1rem 0;
    background: #00000014;
    transition: all 0.2s;

    &:hover {
      border-color: #ffffff;
    }

    > a {
      display: block;
      padding: 1rem;
    }

    code {
      font-family: monospace;
      font-style: normal;
      color: #cecece;
      background: none;
    }
  }
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { DeviceInfo } from "@/types";
import Icon from "@/components/Icon.vue";

@Component({
  components: {
    Icon,
  }
})

export default class Welcome extends Vue {
  private devices!: DeviceInfo[];
  private version!: string;
  private device!: DeviceInfo;

  private async mounted() {
    try {
      const { version, list } = await fetch("/api/devices").then(r => r.json());
      this.version = version;
      this.devices = list;
    } catch (e) {
      // todo: error handling
    }
  }

  private data() {
    return {
      devices: [],
      version: "",
      device: {}
    };
  }

  private add() {
    // todo: add via TCP
  }
}
</script>
