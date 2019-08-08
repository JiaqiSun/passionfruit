<template>
  <canvas ref="icon" :width="w" :height="h" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { IconInfo } from '@/types';

const DEFAULT_SIZE = 32;

@Component
export default class Icon extends Vue {
  @Prop() private icon!: IconInfo;
  @Prop() private width!: number;
  @Prop() private height!: number;

  private redraw() {
    const canvas = this.$refs.icon as HTMLCanvasElement;
    if (!this.icon) {
      return setTimeout(() => this.redraw(), 20);
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const { width, height, pixels } = this.icon;
    const imageData = ctx.createImageData(width, height);

    try {
      const buf = Uint8ClampedArray.from(atob(pixels), (c) => c.charCodeAt(0));
      imageData.data.set(buf);
    } catch (_) {
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(imageData, (canvas.width - width) / 2, (canvas.height - height) / 2);
    ctx.scale(canvas.width / width, canvas.height / height);
  }

  get w() {
    return (
      (this.width > 0 ? this.width : this.icon && this.icon.width) ||
      DEFAULT_SIZE
    );
  }

  get h() {
    return (
      (this.height > 0 ? this.height : this.icon && this.icon.height) ||
      DEFAULT_SIZE
    );
  }

  private mounted() {
    this.redraw();
  }
}
</script>

<style scoped>
canvas {
  display: inline-block;
  vertical-align: middle;
}
</style>
