import {defineAsyncComponent, reactive} from "vue"
import { Component, shallowRef } from 'vue'

const Calculator = defineAsyncComponent(() =>
  import('../components/apps/Calculator.vue')
)
const Terminal = defineAsyncComponent(() =>
  import('../components/apps/Terminal.vue')
)
const TextEditor = defineAsyncComponent(() =>
  import('../components/apps/TextEditor.vue')
)
const Spreadsheet = defineAsyncComponent(() =>
  import("../components/apps/spreadsheet/Spreadsheet.vue")
)
const Arcanoid = defineAsyncComponent(() =>
  import("../components/apps/arcanoid/Arcanoid.vue")
)

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
        {
            opened: false,
            showing: false,
            label: 'Spaceship',
            title: 'Spaceship',
            name: 'Spaceship',
            icon: 'fa-place-of-worship',
            component: shallowRef(Arcanoid)
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