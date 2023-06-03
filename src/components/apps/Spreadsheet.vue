<template>
    <Window>
        <template #topbar>
            <slot name="topbar"></slot>
        </template>

        <template #window>
            <div id="container">
                <div id="settings">
                    <span>Cells: {{ cells.length }}</span>
                    Columns: <input type="number" v-model="numberOfColumns">
                    Rows: <input type="number" v-model="numberOfRows">
                </div>
                <div id="cells">
                    <input class="cell" v-for="cell in cells" type="text" v-model="cell.text">
                </div>
            </div>
        </template>
    </Window>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import Window from '../Window.vue';

const numberOfColumns = ref<number>(5)
const numberOfRows = ref<number>(5)

type Cell = {
    text: string,
}

const cells = computed<Cell[]>(() => {
    let cells: Cell[] = []
    let numberOfCells = numberOfRows.value * numberOfColumns.value

    for (let i = 0; i < numberOfCells; i++) {
        cells.push({
            text: ""
        })
    }
    return cells
})

</script>

<style scoped>
#container {
    width: 900px;
    height: 400px;
    background-color: white;
    overflow-y: auto;
    overflow-x: auto;
}

#settings {
    margin-bottom: 10px;
}

#cells {
    display: grid;
    grid-template-columns: repeat(v-bind(numberOfColumns), 100px);
    grid-template-rows: repeat(v-bind(numberOfRows), 25px);
    height: 100%;
    width: 100%;
}

.cell {
    border: 1px solid #ccc;
}

.cell:focus {
    outline: none;
    background: #cccccc3e
}
</style>