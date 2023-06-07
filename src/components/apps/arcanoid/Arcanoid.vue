<template>
    <Window>
        <template #topbar>
            <slot name="topbar"></slot>
        </template>

        <template #window>
            <div id="container">
            </div>
        </template>
    </Window>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import Window from '../../Window.vue';

const state = reactive({
    timePassed: 0
})

const loop = () => {
    while (true) {
        state.timePassed += 0.1
    }
}
</script>

<style scoped>
#container {
    width: 300px;
    height: 300px;
    background: black;
}
</style>