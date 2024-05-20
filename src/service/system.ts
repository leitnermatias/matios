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
                <p>Usage example: mkdir /ABSOLUTE/PATH/TO/FOLDER</p>
                `)
            }

            return FileSystem.mkdir(args[0])
        },
        help: `
            <p>Create a directory in the system</p>
            <p>Usage example: mkdir /ABSOLUTE/PATH/TO/FOLDER</p>
        `,
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
                output += `<span style='color: green'>${child.label}</span> `
            })

            ctx.history.value.push(output)

            return null
        },
        help: `
        <p>Shows the contents of the current directory</p>
        `,
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