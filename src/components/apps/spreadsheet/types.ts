import { Component } from "vue"

export type CellFormat = {
    background?: string,
    border?: string,
    color?: string
}

export type Cell = {
    text: string,
    identifier: string,
    format?: {background?: string, border?: string}
}

export interface Sheet {
    name: string,
    id: string,
    cells: {
        [key: string]: {
            [key: string]: Cell
        }
    },
    numberOfColumns: number,
    numberOfRows: number,
    columnNames: string[],
    rowNames: string[],
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