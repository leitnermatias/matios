class SystemPoint {
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


function mkdir(path: string, currentSystemPoint: SystemPoint = fileSystemRoot): Error | null {
    let separated = path.split('/').filter(Boolean)

    for (let i = 0; i < separated.length; i++) {

        const foundDir = currentSystemPoint.childs.find(child => child.label === separated[i])

        if (!foundDir) {
            if (i === separated.length - 1) {
                currentSystemPoint.addChild(new SystemPoint(separated[i]))
            } else {
                return new Error(`The directory ${separated[i]} doesn't exist`)
            }
        } else if (foundDir && i === separated.length - 1) {
            return new Error(`The directory ${separated[i]} already exists`)
        } else {
            currentSystemPoint = foundDir
        }
        
    }

    return null
}

const test = mkdir("/usr/home")

console.log(test, fileSystemRoot)

export default {
    fileSystemRoot,
    mkdir
}