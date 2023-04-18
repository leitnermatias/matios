<template>
    <div id="container" ref="el" :style="style" style="position: fixed">
        <slot name="topbar"></slot>

        <div id="window">
            <div id="left-nav">
                <button class="config-button">Colors</button>
            </div>
            <div id="config">
                <component :is="activeScreen?.component"></component>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {useDraggable} from "@vueuse/core"
import {computed, reactive, ref} from "vue"
import ColorConfig from "../ColorConfig.vue";

const el = ref<HTMLElement | null>(null)
const { style } = useDraggable(el)

const configScreens = reactive([
    {active: true, component: ColorConfig}
])

const activeScreen = computed(() => {
    return configScreens.find(screen => screen.active)
})

</script>

<style scoped>
#container {
    width: 400px;
    height: 300px;
}

#window {
    background-color: rgba(255, 255, 255, 0.612);
    width: 100%;
    height: 271px;
    display: flex;
    margin: 0;
    padding: 0
}

#left-nav {
    display: flex;
    flex-direction: column;
    width: 25%;
    padding: 5px;
}

.config-button {
    padding: 5px;
    background: rgba(162, 213, 255, 0.34);
    border: none;
    box-shadow: 0px 0px 1px black;
    cursor: pointer;
    border-radius: 2px;
}

.config-button:hover {
    background: rgba(136, 201, 253, 0.432);
}

#config {
    width: 75%;
    padding: 5px;
}
</style>