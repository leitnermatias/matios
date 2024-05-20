<template>
    <Window>
        <template #topbar>
            <slot name="topbar"></slot>
        </template>
        <template #window>
            <div id="container">

                <div id="window">
                    <div id="history">
                        <span v-for="cmd in history" v-html="cmd"></span>
                    </div>
                    <div>
                        <div id="prompt">
                            <span style="width: fit-content">
                                {{ cwd }} <b style="color: green">></b>
                            </span>
                            <input v-model="command" @keyup.enter="runCommand" id="prompt-input" type="text">
                        </div>
                    </div>
                </div>

            </div>
        </template>
    </Window>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import Window from "../Window.vue"
import FileService from "@/service/filesystem"
import System from "@/service/system"

const rootFS = ref(FileService.fileSystemRoot)
const currentDir = ref(rootFS)

const cwd = computed(() => {
    return currentDir.value.getPath()
})

const command = ref("")
const history = ref<string[]>([])

const context = computed(() => {
    return {
        prompt: command,
        history: history,
        currentDir: currentDir
    }
})

function runCommand() {
    const toExec = command.value.split(' ')[0]
    const sysCommand = System.publicCommands.find(cmd => cmd.exec === toExec)
    if (sysCommand) {
        history.value.push(`${cwd.value} ${command.value}`)
        const result = sysCommand.func(context.value)
        if (result) {
            history.value.push(result.message)
        }
    } else {
        history.value.push(`The command ${toExec} is not a valid command`)
    }

    command.value = ''
}
</script>

<style scoped>
#window {
    background: black;
    width: 600px;
    height: 300px;
    font-family: monospace;
    display: flex;
    flex-direction: column;
    overflow: auto;
    color: white;
    padding-left: 5px;
}

#prompt {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 5px;
}

#prompt-input {
    width: fit-content;
    background-color: black;
    color: green;
    border: none;
}

#prompt-input:focus {
    border: none;
    outline: none;
}

#history {
    display: flex;
    flex-direction: column;
}
</style>