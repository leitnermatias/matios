export class SystemPoint {
    label: string
    childs: SystemPoint[]
    parent: SystemPoint | null

    constructor(label: string) {
        this.label = label
        this.childs = [] // Replace for assignment on constructor
        this.parent = null
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

}

const fileSystemRoot = new SystemPoint('/')

// Default folders
const defaultLabels = ['usr', 'home', 'bin', 'proc']
defaultLabels.forEach(label => {
    fileSystemRoot.addChild(
        new SystemPoint(label)
    )
})


export default {
    fileSystemRoot,
}