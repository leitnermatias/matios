<template>
    <Window>
        <template #topbar>
            <slot name="topbar"></slot>
        </template>

        <template #window>
            <Popup v-if="popups.add">
                <div class="popup" style="min-width: fit-content">
                    <label class="popup-field">
                        Enter a name for the spreadsheet
                        <input type="text" v-model="newSpreadsheet.name">
                    </label>

                    <label class="popup-field">
                        Initial number of rows
                        <input type="number" v-model="newSpreadsheet.numberOfRows">
                    </label>

                    <label class="popup-field">
                        Initial number of columns
                        <input type="number" v-model="newSpreadsheet.numberOfColumns">
                    </label>

                    <div class="popup-buttons">
                        <button class="popup-button" @click="popups.add = false">Cancel</button>
                        <button class="popup-button" @click="addSpreadsheet">Continue</button>
                    </div>
                </div>
            </Popup>
            <div id="container">
                <div id="buttons">
                    <span class="button" @click="popups.add = true" title="New spreadsheet"><v-icon name="fa-plus"></v-icon></span>
                </div>
                <div id="tabs">
                    <span class="tab" :class="{active: tab.open}" @click="setOpenTab(tab)" v-for="tab in activeTabs">{{tab.name}} <v-icon @click="closeTab(tab)" name="fa-times"></v-icon></span>
                </div>
                <component 
                v-if="openedTab"
                :is="components[openedTab.type]"
                :appState="appState"
                :tabState="openedTab"
                ></component>
            </div>
        </template>
    </Window>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import Window from '../../Window.vue';
import { AppState, Sheet as Spreadsheet, Tab } from './types';
import { getCellIdentifiers, getCells } from './utils';
import Sheet from './tabs/Sheet.vue';
import Settings from './tabs/Settings.vue';
import Popup from '../../Popup.vue';
import { useLocalStorage } from '@vueuse/core';

const components = {
    'Sheet': Sheet,
    'Settings': Settings
}

const activeTabs = computed(() => {
    return appState.value.tabs.filter(tab => tab.active)
})

const openedTab = computed(() => {
    return activeTabs.value.find(tab => tab.active && tab.open)
})

const appState = useLocalStorage<AppState>('spreadsheets',{
    spreadsheets: [],
    tabs: [
        {active: false, open: false, name: 'Settings', type: 'Settings', id: crypto.randomUUID()},
    ]
})

const popups = reactive({
    add: false
})

function setOpenTab(tabToSet: Tab) {
    tabToSet.open = true
    activeTabs.value.forEach(tab => {
        if (tab.id !== tabToSet.id) {
            tab.open = false
        }
    })
}

function setActiveTab(tabToSetName: string, active: boolean) {
    const tab = appState.value.tabs.find(tab => tab.name === tabToSetName)

    if (tab) {
        tab.active = active
    }
}

function closeTab(tab: Tab) {
    if (tab.type === 'Sheet') {
        appState.value.spreadsheets = appState.value.spreadsheets.filter(sheet => sheet.id !== tab.name)
    }

    tab.open = false
    tab.active = false
}

const newSpreadsheet = ref<Spreadsheet>({
    name: "",
    id: "",
    cellsMap: {},
    cellsArray: [],
    numberOfColumns: 0,
    numberOfRows: 0,
    columnNames: [],
    rowNames: [],
})

function addSpreadsheet() {
    const {name, numberOfColumns, numberOfRows} = newSpreadsheet.value

    if (name !== "" && numberOfColumns > 0 && numberOfRows > 0) {

        
        let columnNames: string[] = getCellIdentifiers(numberOfColumns)
        let rowNames: string[] = getCellIdentifiers(numberOfRows)
        let {cellsMap, cellsArray} = getCells(columnNames, rowNames)

        const id = crypto.randomUUID()

        appState.value.spreadsheets.push({
            name,
            numberOfColumns,
            numberOfRows,
            id,
            cellsMap,
            cellsArray,
            columnNames,
            rowNames,
        })

        appState.value.tabs.push({
            active: true,
            open: false,
            name: name,
            type: 'Sheet',
            id
        })

        popups.add = false
    }
}

</script>

<style scoped>
#container {
    width: 1100px;
    height: 400px;
    background-color: white;
}

#buttons {
    background: #cccccc1f;
    display: flex;
    padding: 2px 5px;
}

.button {
    cursor: pointer;
    color: rgb(64, 64, 64);
}

.button:hover {
    color: black;
}

#tabs {
    display: flex;
    gap: 10px;
    padding: 2px 5px;
}

.tab {
    cursor: pointer;
    border: 1px solid #ccc;
    border-radius: 2px;
    padding: 2px 5px;
    display: flex;
    align-items: center;
    gap: 5px;
}

.tab.active {
    border-bottom: 2px solid rgba(0, 128, 0, 0.438);
}
</style>