import { Cell } from "./types"

export const abc = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

export function getCellIdentifiers(numberOfCells: number) {
    let output: string[] = []
    let excessNumberIdentifier = 0
    let abcIndex = 0
    while (numberOfCells > 0) {

        if (abc[abcIndex] === undefined) {
            excessNumberIdentifier += 1
            abcIndex = 0
        }

        output.push(`${abc[abcIndex].toUpperCase()}${excessNumberIdentifier === 0 ? '' : excessNumberIdentifier}`)

        abcIndex += 1
        numberOfCells -= 1
    }

    return output
}

export function getCells(columnNames: string[], rowNames: string[]): {
    cellsArray: Cell[],
    cellsMap: {
        [key: string]: { // Each row
            [key: string]: Cell  // Each column
        }
    } 
} {
    let cellsArray: Cell[] = []
    let cellsMap: {
        [key: string]: { // Each row
            [key: string]: Cell  // Each column
        }
    } = {}

    rowNames.forEach(row => {
        cellsMap[row] = {}
        columnNames.forEach(column => {
            cellsMap[row][column] = {
                text: "",
                identifier: `${row}:${column}`
            }
            cellsArray.push(cellsMap[row][column])
        })
    })

    return {
        cellsArray,
        cellsMap
    }

}