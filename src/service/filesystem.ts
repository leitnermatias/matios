type SystemPointType = 'FILE' | 'DIRECTORY'

type Permission = 'WRITE' | 'READ'

export class SystemPoint {
    label: string
    childs: SystemPoint[]
    parent: SystemPoint | null
    type: SystemPointType
    permissions: Permission[]
    content: string

    constructor(label: string, type: SystemPointType = 'DIRECTORY', permissions: Permission[] = ['READ']) {
        this.label = label
        this.childs = [] // Replace for assignment on constructor
        this.parent = null
        this.type = type
        this.content = ''
        this.permissions = permissions
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

    traverseAndExecute( callback: (currentSP: SystemPoint) => Error | null, currentSystemPoint: SystemPoint = this, results: Error[] = []): Error[] {
        // Traverses the tree and executes the corresponding callback for each SystemPoint
        if (currentSystemPoint.childs.length === 0) {
            return results
        }
        
        currentSystemPoint.childs.forEach(child => {
            const result = callback(child)

            if (result instanceof Error) {
                results.push(result)
            }

            child.traverseAndExecute(callback, child, results)
        })

        return results
    }

}

const fileSystemRoot = new SystemPoint('/', 'DIRECTORY', ["READ"])

// Default folders
const defaultLabels = ['usr', 'home', 'bin', 'proc']
defaultLabels.forEach(label => {
    fileSystemRoot.addChild(
        new SystemPoint(label, 'DIRECTORY', ["READ"])
    )
})

function findSystemPoint(paths: string[], currentSystemPoint: SystemPoint): Error | SystemPoint {
    // Finds the specific SystemPoint given its path
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