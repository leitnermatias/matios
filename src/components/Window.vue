<template>
    <Draggable
    :handle="handle"
    style="position: fixed"
    >
        <div ref="handle" style="cursor: move">
            <slot name="topbar"></slot>
        </div>

        <div>
            <slot name="window"></slot>
        </div>
        
    </Draggable>
</template>

<script setup lang="ts">
import {UseDraggable as Draggable} from "@vueuse/components"
import { ref } from "vue";

const handle = ref<HTMLElement | null>(null)
</script>

<style scoped>

</style>