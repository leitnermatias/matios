<template>
    <div v-if="sheet" id="cells">
        <input class="cell" v-for="cell in sheet.cells" type="text" v-model="cell.text">
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { AppState, Tab } from '../types';
const props = defineProps<{
    appState: AppState,
    tabState: Tab
}>()

const sheet = computed(() => {
    return props.appState.spreadsheets.find(sheet => sheet.id === props.tabState.id)
})

const columnsNumber = computed(() => {
    return sheet.value ? sheet.value.numberOfColumns : 0
})

const rowsNumber = computed(() => {
    return sheet.value ? sheet.value.numberOfRows : 0
})
</script>

<style scoped>
#cells {
    display: grid;
    grid-template-columns: repeat(v-bind(columnsNumber), 100px);
    grid-template-rows: repeat(v-bind(rowsNumber), 25px);
    padding: 5px;
}

.cell {
    border: 1px solid rgba(0, 0, 0, 0.105);
}

.cell:focus {
    outline: none;
    background: #cccccc3e
}
</style>