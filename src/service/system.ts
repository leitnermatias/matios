import FileSystem, { SystemPoint } from "@/service/filesystem"
import { Ref } from "vue"

type Context = {
    prompt: Ref<string>
    history: Ref<string[]>
    currentDir: Ref<SystemPoint>
}

type Command = {
    exec: string // The name of the command that can be used in the terminal
    func: (ctx: Context) => Error | null // The function to be executed
    help: string // Help text for the command
}

const publicCommands: Command[] = [
    {
        exec: 'mkdir',
        func: (ctx: Context) => {

            const args = ctx.prompt.value.split(' ').slice(1)

            if (args.length === 0 || args.length > 1) {
                return new Error(`
                <b>Invalid arguments for command mkdir</b>
                <p>Usage: <b>mkdir <i>PATH</i></b></p>
                <p>Example usage: <b>mkdir /home/mynewdir</b></p>
                `)
            }

            const dirPath = args[0]

            const isRelativePath = !dirPath.startsWith('/')

            let paths = dirPath.split('/').filter(Boolean)

            let currentSystemPoint = isRelativePath ? ctx.currentDir.value : FileSystem.fileSystemRoot

            for (let i = 0; i < paths.length; i++) {
                const dirFound = currentSystemPoint.childs.find(child => child.label === paths[i])

                if (dirFound) {
                    currentSystemPoint = dirFound
                } else {
                    const newSystemPoint = new SystemPoint(paths[i], 'DIRECTORY', ["WRITE", "READ"])
                    currentSystemPoint.addChild(newSystemPoint)
                    currentSystemPoint = newSystemPoint
                }
            }

            return null
        },
        help: `
            <p>Create a directory in the system</p>
            <p>It will create any directories that don't exist in the path automatically</p>
            <p>Usage example: <b>mkdir <i>PATH</i></b></p>
        `,
    },
    {
        exec: 'cd',
        func: (ctx: Context) => {
            const args = ctx.prompt.value.split(' ').slice(1)

            if (args.length === 0 || args[0] === '') { // Takes user to home directory
                const homeDir = FileSystem.fileSystemRoot.childs.find(child => child.label === 'home')
                if (homeDir) {
                    ctx.currentDir.value = homeDir
                }
            }

            const dirPath = args[0]

            const isRelativePath = !dirPath.startsWith('/')
            
            let paths = dirPath.split('/').filter(Boolean)

            let currentSystemPoint = isRelativePath ? ctx.currentDir.value : FileSystem.fileSystemRoot

            if (currentSystemPoint.label === paths[0]) {
                ctx.currentDir.value = currentSystemPoint
                return null
            } else if (paths[0] === '..') {
                ctx.currentDir.value = currentSystemPoint.parent ? currentSystemPoint.parent : currentSystemPoint
                return null
            }

            for (let i = 0; i < paths.length; i++) {
                const dirFound = currentSystemPoint.childs.find(child => child.label === paths[i])

                if (dirFound) {
                    currentSystemPoint = dirFound
                } else {
                    return new Error(`The specified path doesn't exist`)
                }
            }

            if (currentSystemPoint.type !== 'DIRECTORY') {
                return new Error(`The specified path doesn't lead to a directory`)
            }

            ctx.currentDir.value = currentSystemPoint

            return null
        },
        help: `
            <p>Navigates through the system, you can use a relative or absolute path.</p>
            <p>Usage: <b>cd <i>PATH</i></b></p>
            <p>Usage example: <b>cd /home</b></p>
        `
    },
    {
        exec: 'clear',
        func: (ctx: Context) => {
            ctx.history.value = []
            return null
        },
        help: `
        <p>Clears the terminal, removing all the history</p>
        `,
    },
    {
        exec: 'ls',
        func: (ctx: Context) => {
            let  output = ``

            ctx.currentDir.value.childs.forEach(child => {
                const color = child.type === 'FILE' ? 'white' : 'green'
                output += `<span style='color: ${color}'>${child.label}</span> `
            })

            ctx.history.value.push(output)

            return null
        },
        help: `
        <p>Shows the contents of the current directory</p>
        `,
    },
    {
        exec: 'pwd',
        func: (ctx: Context) => {
            ctx.history.value.push(ctx.currentDir.value.getPath())
            return null
        },
        help: `
            <p>Returns the current directory the user is positioned in</p>
        `
    },
    {
        exec: 'touch',
        func: (ctx: Context) => {

            const args = ctx.prompt.value.split(' ').slice(1)

            if (args.length === 0) {
                return new Error(`
                    <p>Invalid arguments for command <b>touch</b></p>
                    <p>Type <b>help touch</b> to see some usage examples</p>
                `)
            }

            const dirPath = args[0]

            const isRelativePath = !dirPath.startsWith('/')

            let paths = dirPath.split('/').filter(Boolean)

            let currentSystemPoint = isRelativePath ? ctx.currentDir.value : FileSystem.fileSystemRoot

            for (let i = 0; i < paths.length; i++) {
                const dirFound = currentSystemPoint.childs.find(child => child.label === paths[i])

                if (dirFound) {
                    currentSystemPoint = dirFound
                } else {
                    let newSystemPoint: SystemPoint | null = null
                    if (i === paths.length - 1) {
                        // Last in the path, creates the file for it
                        newSystemPoint = new SystemPoint(paths[i], 'FILE')
                    } else {
                        // Otherwise creates the corresponding directory in the path
                        newSystemPoint = new SystemPoint(paths[i], 'DIRECTORY')

                    }
                    currentSystemPoint.addChild(newSystemPoint)
                    currentSystemPoint = newSystemPoint
                }
            }

            return null
        },
        help: `
            <p>Creates a file in the system</p>
            <p>The command will create any directories that don't exist but are present in the path</p>
            <p>Usage: <b>touch <i>PATH</i></b></p>
            <p>Example usage: <b>touch /home/newfile.txt</b></p>
        `
    },
    {
        exec: 'write',
        func: (ctx: Context) => {

            const args = ctx.prompt.value.split(' ').slice(1)

            if (args.length < 2) {
                return new Error(`
                    <p>Invalid arguments for command <b>write</b></p>
                    <p>Type <b>help write</b> to see some usage examples</p>
                `)
            }
            const dirPath = args[0]
            const content = args.slice(1).join(' ')  // Everything after the first argument will be added to the file


            const isRelativePath = !dirPath.startsWith('/')

            let paths = dirPath.split('/').filter(Boolean)

            let currentSystemPoint = isRelativePath ? ctx.currentDir.value : FileSystem.fileSystemRoot

            const file = FileSystem.findSystemPoint(paths, currentSystemPoint)

            if (file instanceof Error) {
                return file
            }

            file.content = content

            return null
        },
        help: `
        <p>Allows writing to the specified file</p>
        <p>Usage: <b>write <i>PATH</i> <i>CONTENT</i></b></p>
        <p>Example usage: <b>write /home/newfile.txt "Hello World!"</b></p>
        `
    },
    {
        exec: 'cat',
        func: (ctx: Context) => {
            const args = ctx.prompt.value.split(' ').slice(1)

            if (args.length === 0) {
                return new Error(`
                    <p>Invalid arguments for command <b>cat</b></p>
                    <p>Type <b>help cat</b> to see some usage examples</p>
                `)
            }

            const dirPath = args[0]

            const isRelativePath = !dirPath.startsWith('/')

            let paths = dirPath.split('/').filter(Boolean)

            let currentSystemPoint = isRelativePath ? ctx.currentDir.value : FileSystem.fileSystemRoot

            const file = FileSystem.findSystemPoint(paths, currentSystemPoint)

            if (file instanceof Error) {
                return file
            } else {
                ctx.history.value.push(file.content)
            }

            return null

        },
        help: `
        <p>Outputs the contents of a file into the terminal</p>
        <p>Usage: <b>cat <i>PATH</i></b></p>
        <p>Example usage: <b>cat /home/newfile.txt</b></p>
        `
    },
    {
        exec: 'rm',
        func: (ctx: Context) => {
            const args = ctx.prompt.value.split(' ').slice(1)

            if (args.length === 0) {
                return new Error(`
                    <p>Invalid arguments for command <b>rm</b></p>
                    <p>Type <b>help rm</b> to see some usage examples</p>
                `)
            }

            const dirPath = args[0]

            if (dirPath === '/') {
                return new Error("Permission denied: can't delete the / directory")
            }

            const isRelativePath = !dirPath.startsWith('/')

            let paths = dirPath.split('/').filter(Boolean)

            let currentSystemPoint = isRelativePath ? ctx.currentDir.value : FileSystem.fileSystemRoot

            
            const file = FileSystem.findSystemPoint(paths, currentSystemPoint)
            

            if (file instanceof Error) {
                return file
            } else {
                if (!file.permissions.includes('WRITE')) {
                    return new Error(`Permission denied: ${file.label} is read-only`)
                }

                const errors = file.traverseAndExecute(
                    (currentSystemPoint) => {
                        if (!currentSystemPoint.permissions.includes('WRITE')) {
                            return new Error (`Permission denied: ${currentSystemPoint.label} is read-only`)
                        }
                        return null
                    }
                )

                if (errors.length > 0) {
                    errors.forEach(error => ctx.history.value.push(error.message))
                    return new Error(`Error while trying to delete the system point ${file.label}`)
                }

                if (file.parent !== null) {
                    file.parent.childs = file.parent.childs.filter(child => child.label !== file.label)  // Remove child reference
                    file.parent = null // Remove parent reference
                }
            }

            return null
        },
        help: `
        <p>Removes the corresponding systempoint in the specified path and all of its children</p>
        <p>Usage: <b>rm <i>PATH</i></b></p>
        <p>Example usage: <b>rm /home/newfile.txt</b></p>
        `
    },
    {
        exec: 'help',
        func: (ctx: Context) => {
            const args = ctx.prompt.value.split(' ').slice(1)

            if (args.length === 0) {
                ctx.history.value.push(`
                    To know more about a command you can use:
                    <br>
                    <b>help <i>COMMAND_NAME</i></b>
                    <br>
                    Some useful commands (to see full list use <b>help -l</b>):
                    <br>
                    <ul>
                        <li>
                            ls
                        </li>
                        <li>
                            mkdir
                        </li>
                        <li>
                            clear
                        </li>
                        <li>
                            cd
                        </li>
                        <li>
                            pwd
                        </li>
                    </ul>
                `)
            } else if (args[0] === '-l') {
                const availableCommands = publicCommands.map(cmd => cmd.exec)

                let output = `
                These are all the available commands:
                <br>
                <ul>
                `

                availableCommands.forEach(cmd => output += `<li>${cmd}</li>`)

                output += `</ul>`

                ctx.history.value.push(output)
            } else {
                const cmd = publicCommands.find(cmd => cmd.exec === args[0])
                if (cmd) {
                    ctx.history.value.push(cmd.help)
                } else {
                    ctx.history.value.push(`
                        The command you are trying to get help with doesn't exist 
                        <br> 
                        Try using <b>help -l</b> to get a list of available commands
                    `)
                }
            }

            return null
        },
        help: `
        <p>Shows help about any command, or a list of commands available</p>
        <p>Usage example: 
            <br>
            <b>help <i>mkdir</i></b> to show help about the mkdir command
        </p>
        <p>Type <b>help -l</b> to get the complete list of commands available</p>
        `,
    }
]

export default {
    publicCommands: [
        ...publicCommands,
    ]
}