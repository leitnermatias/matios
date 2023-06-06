<template>
    <!-- <div v-if="sheet" id="cells">
        <span v-for="column in sheet?.columnNames" class="column">{{ column }}</span>
        <span v-for="row in sheet?.numberOfRows" class="row">{{ row }}</span>
        <input 
        class="cell" 
        v-for="cell in sheet.cells" 
        :style="cell.format" 
        type="text" 
        @keyup.enter="interpretCellValue(cell)" 
        @blur="interpretCellValue(cell)" 
        v-model="cell.text"
        >
    </div> -->

    <table v-if="sheet" id="cells">
        <thead>
            <tr>
                <th>

                </th>
                <th class="column identifier" v-for="columnId in sheet.columnNames">
                    {{ columnId }}
                </th>
            </tr>
        </thead>

        <tbody>
            <tr v-for="cell in sheet.numberOfRows">
                <p class="row identifier">
                    {{ cell }}
                </p>
                <td v-for="cellColumn in sheet.columnNames" :title="`${cellColumn}:${cell}`">
                    <input 
                    type="text"
                    class="cell" 
                    >
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { AppState, Tab, Cell, CellFormat } from '../types';
const props = defineProps<{
    appState: AppState,
    tabState: Tab
}>()

const sheet = computed(() => {
    return props.appState.spreadsheets.find(sheet => sheet.id === props.tabState.id)
})

function interpretCellValue(cell: Cell) {

    const input = cell.text
    formatCell(cell)

    if (input.startsWith("$")) {
        try {
            const newValue = eval(input.slice(1))
            cell.text = newValue.toString()
        } catch {
            formatCell(cell, {
                border: '1px solid red'
            })
        }
    }
}

function formatCell(cell: Cell, style?: CellFormat) {
    cell.format = style
}
</script>

<style scoped>

#cells {
    overflow: scroll;
    display: block;
    max-width: 1100px;
    max-height: 326px;
    width: 1100px;
    height: 326px;
}

td, tr {
    margin: 0px;
    padding: 0px;
}
.cell {
    border: 1px solid rgba(0, 0, 0, 0.105);
    width: 100px;
    height: 20px;
    margin: 0px;
    padding: 0px;
    border-radius: 0px;
    background-color: #cccccc0b;
}

.cell:focus {
    outline: none;
    background: #cccccc3e
}

.identifier {
    background: #cccccc55;
    border: 1px solid #ccc;
    margin: 0px;
    padding: 0px;
}

.row {
    width: 20px;
    text-align: center;
    font-size: 12px;
}

</style>