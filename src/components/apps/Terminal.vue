<template>
    <div id="container" ref="el" :style="style" style="position: fixed">
        <slot name="topbar"></slot>

        <div id="window"> 
            <span class="history-command" v-for="command in history">
                <span>
                    {{ command.path }} > {{ command.command }}
                </span>
                <span>
                    {{ command.result }}
                </span>
            </span>
            <span id="prompt">
                {{ currentFolder.path }} > 
                <input id="prompt-input" v-model="currentCommand" type="text" v-on:keyup.native.enter="runCommand">
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import {useDraggable} from "@vueuse/core"
import {computed, reactive, ref} from "vue"

const el = ref<HTMLElement | null>(null)

const { style } = useDraggable(el)

interface CommandResult {
    command: string,
    result: string,
    path: string
}
const history = ref<CommandResult[]>([])
const currentCommand = ref("");

interface FileSystemElement {
    path: string,
    active: boolean,
    parent: null | string
}



class Folder {
  path: string;
  active: boolean;
  contents: Folder[];

  constructor(path: string, contents: Folder[] = [], active: boolean = false) {
    this.path = path;
    this.contents = contents;
    this.active = active;
  }

  getChildByPath(path: string): Folder | null {
    let fullPath = path;
    if (!path.startsWith("/")) {
      fullPath = `${this.path}${this.path.endsWith('/') ? '' : '/'}${path}`;
    }

    if (this.path === fullPath) {
      return this;
    }

    for (const child of this.contents) {
      const foundChild = child.getChildByPath(fullPath);
      if (foundChild) {
        return foundChild;
      }
    }

    return null;
  }

  getActiveFolder(): Folder | null {
    if (this.active) {
      return this;
    }

    for (const child of this.contents) {
      const activeChild = child.getActiveFolder();
      if (activeChild) {
        return activeChild;
      }
    }

    return null;
  }

  getRelativeContents(): Folder[] {
    const relativeContents: Folder[] = [];
    for (const child of this.contents) {
        let childPath = child.path.split('/').pop()
        const relativeChild = new Folder(childPath || '', child.contents);
        relativeContents.push(relativeChild);
    }
    return relativeContents;
  }

  getParent(): Folder | null {
    const parentPath = this.path.split("/").slice(0, -1).join("/");
    if (parentPath === "") {
      return null;
    }
    return new Folder(parentPath);
  }

}

const fileSystemRoot = reactive(
    new Folder(
        "/",
        [
            new Folder(
                "/home",
                [
                    new Folder("/home/Documents"),
                    new Folder("/home/Photos"),
                    new Folder("/home/Videos"),
                    new Folder("/home/Games"),
                    new Folder("/home/Projects"),
                ]
            ),
            new Folder("/usr"),
            new Folder("/bin"),
            new Folder("/local"),
        ],
        true
    )
)

const currentFolder = computed(() => {
    const current = fileSystemRoot.getActiveFolder()

    if (current) {
        return current
    }

    return fileSystemRoot
})



function runCommand() {
    const command = currentCommand.value
    const params = command.split(' ').slice(1)
    let commandResult: CommandResult
    let afterHistoryCallback: (() => void) | null = null;

    switch (command.split(' ')[0]) {
        case 'ls':
            commandResult = {command, result: currentFolder.value.getRelativeContents().map(f => f.path).join(' '), path: currentFolder.value.path}
            break;
        case 'cd':
            let folderToMove: Folder | null

            if (params[0].startsWith("/")) {
                folderToMove = fileSystemRoot.getChildByPath(params[0])
            } else if (params[0] === '..') {
                const parentPath = currentFolder.value.path.split('/').reverse().slice(1).reverse().join('/')
                folderToMove = fileSystemRoot.getChildByPath(parentPath)
            } else {
                folderToMove = currentFolder.value.getChildByPath(params[0])
            }

            const current = fileSystemRoot.getActiveFolder()

            if (!folderToMove) {
                commandResult = {command, result: 'The folder was not found in the current directory.', path: currentFolder.value.path}
                break;
            }

            afterHistoryCallback = () => {
                if (folderToMove) {
                    folderToMove.active = true;
                }

                if (current) {
                    current.active = false;
                }
            }

            commandResult = {command, result: '', path: currentFolder.value.path}

            break;
        case 'clear':
            commandResult = {command, result: '', path: currentFolder.value.path}
            afterHistoryCallback = () => {
                history.value = []
            }
            break;
        case 'echo':
            const result = params.join(' ');
            commandResult = {command, result, path: currentFolder.value.path}
            break;
        default:
            commandResult = {command, result: `${command} is not a recognized command.`, path: currentFolder.value.path}
            break;
    }
    history.value.push(commandResult)

    if(afterHistoryCallback) {
        afterHistoryCallback()
    }

    currentCommand.value = ""
}


</script>

<style scoped>
#container {
    width: 500px;
    height: 300px;
}

#window {
    background: black;
    width: 100%;
    height: 100%;
    font-family: monospace;
    display: flex;
    flex-direction: column;
    overflow: auto;
}

#prompt, .history-command {
    color: white;
    padding: 5px;
}

#prompt-input {
    background-color: black;
    border: none;
    font-family: monospace;
    color: white;
}

#prompt-input:focus {
    outline: none;
    border: none;
}

.history-command {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
</style>