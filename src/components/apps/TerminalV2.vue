<template>
    <Window>
        <template #topbar>
            <slot name="topbar"></slot>
        </template>
        <template #window>
            <div id="container">

                <div id="window">
                    {{ cwd }}
                </div>

            </div>
        </template>
    </Window>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import Window from "../Window.vue"
import FileService from "@/service/filesystem"

const rootFS = ref(FileService.fileSystemRoot)
const currentDir = ref(rootFS)

const cwd = computed(() => {
    return currentDir.value.getPath()
})
</script>

<style scoped>
#window {
    background: black;
    width: 500px;
    height: 300px;
    font-family: monospace;
    display: flex;
    flex-direction: column;
    overflow: auto;
    color: white;
    padding-left: 5px;
}
</style>