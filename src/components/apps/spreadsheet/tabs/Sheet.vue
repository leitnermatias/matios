<template>

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
            <tr v-for="row in Object.keys(sheet.cellsMap)">
                <p class="row identifier">
                    {{ row }}
                </p>
                <td v-for="column in Object.keys(sheet.cellsMap[row])" :title="`${row}:${column}`">
                    <input 
                    type="text"
                    class="cell" 
                    :style="sheet.cellsMap[row][column].format"
                    v-model="sheet.cellsMap[row][column].text"
                    @keyup.enter="interpretCellValue(sheet!.cellsMap[row][column])" 
                    @blur="interpretCellValue(sheet!.cellsMap[row][column])" 
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
            formatCell(cell, cellFormats.error)
        }
    } else if (input.startsWith("=")) {
        const funcToCall = getParametersForFunction(input.slice(1))

        if (funcToCall) {
            let funcResult: string | number |  null = null

            switch (funcToCall.name) {
                case 'sum':
                    funcResult = sum(...funcToCall.parameters)
                break;
                case 'multiply':
                    funcResult = multiply(...funcToCall.parameters)
                break;
            }

            if (!funcResult) {
                formatCell(cell, cellFormats.error)
            } else {
                cell.text = funcResult.toString()
            }
        }
    }
}

function formatCell(cell: Cell, style?: CellFormat) {
    cell.format = style
}

const cellFormats = {
    error: {
        border: '1px solid red',
    }
}

type SpreadsheetFunction = {
    name: string,
    parameters: string[]
}
function getParametersForFunction(func: string): SpreadsheetFunction | undefined {
    if (sheet.value) {
        const parameters = func.match(/[^(),\s]+/g)
        
        if (parameters) {
            return {
                name: parameters[0],
                parameters: [...parameters.slice(1).map(parameter => getParameterValue(parameter))]
            }
        }

    }
}

function getParameterValue(parameter: string): string {
    if (/[A-Z]\d*:[A-Z]\d*/g.test(parameter)) {
        const row = parameter.split(':')[0]
        const column = parameter.split(':')[1]
        const cell = sheet.value?.cellsMap[row][column]

        if (cell) {
            return cell.text
        }
    }

    return parameter
}

function sum(...args: string[]): number {
    return args.map(arg => parseFloat(arg)).reduce((prevValue, currentValue) => prevValue += currentValue)
}

function multiply(...args: string[]): number {
    return args.map(arg => parseFloat(arg)).reduce((prevValue, currentValue) => prevValue *= currentValue)
}
</script>

<style scoped>

#cells {
    overflow: auto;
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
    cursor: default;
}

.row {
    width: 20px;
    height: 20px;
    text-align: center;
    font-size: 12px;
}

</style>