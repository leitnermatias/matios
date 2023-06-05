import { Component } from "vue"

export type Cell = {
    text: string
}

export type Sheet = {
    name: string,
    id: string,
    cells: Cell[],
    numberOfColumns: number,
    numberOfRows: number,
}

export type AppState = {
    spreadsheets: Sheet[],
}

export type TabType = 'Sheet' | 'Normal'

export type Tab = {
    active: boolean,
    open: boolean,
    name: string,
    component: Component,
    type: TabType,
    id: string
}