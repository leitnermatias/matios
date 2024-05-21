type SystemPointType = 'FILE' | 'DIRECTORY'

export class SystemPoint {
    label: string
    childs: SystemPoint[]
    parent: SystemPoint | null
    type: SystemPointType
    content: string

    constructor(label: string, type: SystemPointType = 'DIRECTORY') {
        this.label = label
        this.childs = [] // Replace for assignment on constructor
        this.parent = null
        this.type = type
        this.content = ''
    }

    addChild(newSystemPoint: SystemPoint) {
        newSystemPoint.parent = this
        this.childs.push(newSystemPoint)
    }

    getChildLabels() {
        return this.childs.map(child => child.label)
    }

    getPath(current: SystemPoint = this, path: string = ''): string {
        if (current.parent === null) {
            return current.label + path
        } else {
            path = `${current.label}/${path}`
        }

        return current.getPath(current.parent, path)
    }

    write(newContent: string) {
        this.content = newContent
    }

}

const fileSystemRoot = new SystemPoint('/')

// Default folders
const defaultLabels = ['usr', 'home', 'bin', 'proc']
defaultLabels.forEach(label => {
    fileSystemRoot.addChild(
        new SystemPoint(label)
    )
})

function findSystemPoint(paths: string[], currentSystemPoint: SystemPoint): Error | SystemPoint {

    for (let i = 0; i < paths.length; i++) {
        const dirFound = currentSystemPoint.childs.find(child => child.label === paths[i])

        if (dirFound) {
            currentSystemPoint = dirFound
        } else {
            return new Error(`The specified path doesn't exist`)
        }
    }

    return currentSystemPoint

}


export default {
    fileSystemRoot,
    findSystemPoint
}