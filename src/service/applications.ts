import {reactive} from "vue"
import { Component, shallowRef } from 'vue'
import Calculator from "../components/apps/Calculator.vue"
import Terminal from "../components/apps/Terminal.vue"
import TextEditor from "../components/apps/TextEditor.vue"
import Spreadsheet from "../components/apps/spreadsheet/Spreadsheet.vue"

export type Application = {
    opened: boolean,
    showing: boolean,
    label: string,
    title: string,
    name: string,
    icon?: string,
    component: Component,
    styles?: string,
}

export default reactive<
    {
        applications: Application[],
        openApp: (application: Application) => void,
        closeApp: (application: Application) => void,
    }
>({
    // Setup default applications here
    applications: [
        {
            opened: false,
            showing: false,
            label: 'Calculator',
            title: 'Calculator',
            name: 'Calculator',
            icon: 'fa-calculator',
            component: shallowRef(Calculator)
        },
        {
            opened: false,
            showing: false,
            label: 'Terminal',
            title: 'Terminal',
            name: 'Terminal',
            icon: 'fa-terminal',
            component: shallowRef(Terminal)
        },
        {
            opened: false,
            showing: false,
            label: 'Notes',
            title: 'Notes',
            name: 'Notes',
            icon: 'fa-pencil-alt',
            component: shallowRef(TextEditor)
        },
        {
            opened: false,
            showing: false,
            label: 'Spreadsheets',
            title: 'Spreadsheets',
            name: 'Spreadsheets',
            icon: 'fa-chart-bar',
            component: shallowRef(Spreadsheet)
        },
    ],
    openApp(application: Application) {
        application.opened = true;
        application.showing = true;
    },
    closeApp(application: Application) {
        application.opened = false;
        application.showing = false;
    }
})