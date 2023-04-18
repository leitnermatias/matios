<template>
    <div id="container" ref="el" :style="style" style="position: fixed">
        <slot name="topbar"></slot>

        <div id="window">
            <div id="screen">
                {{currentOperation || 'Please enter your operation'}}
            </div>
            <div id="buttons">
                <div id="numbers">
                    <button @click="addToOperation(number)" class="number-button" v-for="number in ['1','2','3','4','5','6','7','8','9','.','0']">
                        {{ number }}
                    </button>
                </div>
                <div id="operations">
                    <button @click="() => currentOperation = ''">C</button>
                    <button @click="addToOperation('+')">+</button>
                    <button @click="addToOperation('*')">*</button>
                    <button @click="addToOperation('-')">-</button>
                    <button @click="addToOperation('/')">/</button>
                    <button @click="doOperation">=</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {useDraggable} from "@vueuse/core"
import {ref} from "vue"

const el = ref<HTMLElement | null>(null)

const currentOperation = ref("");

function addToOperation(toAdd: string) {
    currentOperation.value += `${toAdd}` 
}

function doOperation() {
    currentOperation.value = eval(currentOperation.value)
}

const { style } = useDraggable(el)
</script>

<style scoped>

#window {
    background-color: white;
    width: 250px;
    height: 250px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 10px;
}

#screen {
    width: 90%;
    height: fit-content;
    display: flex;
    justify-content: flex-end;
    padding: 10px 5px;
    border: 1px solid rgba(23, 147, 242, 0.354);
}

#buttons {
    margin-top: 20px;
    width: 90%;
    display: flex;
    gap: 5px;
}

#numbers {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 5px;
    width: 60%;
}

.number-button:last-of-type{
    grid-column-start: 2;
    
}

#operations {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 5px;
    width: 40%;
}

button {
    padding: 10px;
    cursor: pointer;
    background-color: white;
    border: none;
    box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.379);
}

button:hover {
    box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.379);
}
</style>