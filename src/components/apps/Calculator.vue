<template>
    <div id="container" ref="el" :style="style" style="position: fixed">
        <slot name="topbar"></slot>
        <div id="window">
        </div>
    </div>
</template>

<script setup lang="ts">
import {useDraggable} from "@vueuse/core"
import {ref} from "vue"

const el = ref<HTMLElement | null>(null)

// `style` will be a helper computed for `left: ?px; top: ?px;`
const { x, y, style } = useDraggable(el, {
  initialValue: { x: 40, y: 40 },
})
</script>

<style scoped>
#container {
    width: 250px;
    height: 400px;
}

#window {
    background-color: white;
    width: 100%;
    height: 100%;
}
</style>