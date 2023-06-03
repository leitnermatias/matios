<template>
    <Window>
        <template #topbar>
            <slot name="topbar"></slot>
        </template>

        <template #window>
            <Popup v-if="popups.new">
                <div class="popup">
                    <label>
                        Name
                        <input type="text" v-model="newNote.name">
                    </label>

                    <div class="popup-buttons">
                        <button class="action-button" @click="popups.new = false">Cancel</button>
                        <button class="action-button" @click="addNote">Continue</button>
                    </div>
                </div>
            </Popup>
            <Popup v-if="popups.save">
                <div class="popup">
                    Saved!

                    <div class="popup-buttons">
                        <button class="action-button" @click="popups.save = false">
                            Close
                        </button>
                    </div>
                </div>
            </Popup>
            <Popup v-if="popups.load">
                <div class="popup">
                    <select v-model="noteToLoad">
                        <option :value="null"></option>
                        <option v-for="note in notesStorage.notes" :value="note">{{ note.name }}</option>
                    </select>

                    <div class="popup-buttons">
                        <button class="action-button" @click="popups.load = false">
                            Cancel
                        </button>
                        <button class="action-button" @click="loadNote">Load</button>
                    </div>
                </div>
            </Popup>
            <Popup v-if="popups.delete">
                <div class="popup">
                    You are about to delete the current note. Are you sure?

                    <div class="popup-buttons">
                        <button class="action-button" @click="popups.delete = false">Cancel</button>
                        <button class="action-button" @click="deleteNote">Continue</button>
                    </div>
                </div>
            </Popup>
            <div id="buttons">
                <button class="action-button" @click="popups.new = true">
                    New
                </button>
                <button v-if="notesStorage.active" class="action-button" @click="saveNote()">
                    Save
                </button>
                <button v-if="notesStorage.notes.length > 0" class="action-button" @click="popups.load = true">
                    Load
                </button>
                <button v-if="notesStorage.active" class="action-button" @click="popups.delete = true">
                    Delete
                </button>
                <button v-if="notesStorage.active" class="action-button" @click="notesStorage.active = null">Stop editing</button>
            </div>
            <span id="active-note-name" v-if="notesStorage.active">Editing: {{ notesStorage.active.name }}</span>
            <textarea v-if="notesStorage.active" id="text" v-model="notesStorage.active.text">
            </textarea>
            <textarea v-else id="text" style="text-align: left; font-size: 12px" disabled>
                {{ notesStorage.notes.length === 0 ? 'No notes found, please create a new one.' : 'Please load a note or create a new one.'}}
                
            </textarea>
        </template>
    </Window>
</template>

<script setup lang="ts">
import Window from '../Window.vue';
import Popup from "../Popup.vue"
import { onMounted, reactive, ref } from 'vue';
import {useLocalStorage} from "@vueuse/core"

const notesStorage = useLocalStorage<{
    active: Note | null,
    notes: Note[]
}>('textEditor', {
    active: null,
    notes: []
})


onMounted(() => {
    if (notesStorage.value.notes.length === 0) {
        popups.new = true
    } else {
        notesStorage.value.active = notesStorage.value.active ? notesStorage.value.active : notesStorage.value.notes[0]
    }
})

const popups = reactive({
    new: false,
    save: false,
    load: false,
    delete: false,
})

type Note = {
    name: string,
    id: string,
    text: string,
}

const newNote = ref<Note>({
    name: "",
    id: "",
    text: ""
})

const noteToLoad = ref<Note | null>(null)

// Note functionality
function addNote() {
    if (newNote.value.name.length > 0) {
        saveNote(false)
        newNote.value.id = `${newNote.value.name}-${notesStorage.value.notes.length}`
        notesStorage.value.notes.push(newNote.value)
        notesStorage.value.active = newNote.value
        newNote.value = {
            name: "",
            id: "",
            text: ""
        }
        popups.new = false
    }
}

function loadNote() {
    if (noteToLoad.value) {
        saveNote(false)
        notesStorage.value.active = noteToLoad.value
        noteToLoad.value = null
        popups.load = false
    }
}

function saveNote(withPopup: boolean = true) {
    if (notesStorage.value.active) {
        notesStorage.value.notes.forEach(note => {
            if (note.id === notesStorage.value.active?.id) {
                note.text = notesStorage.value.active.text

                if (withPopup) {
                    popups.save = true
                }
            }
        })
    }
}

function deleteNote() {
    if (notesStorage.value.active) {
        notesStorage.value.notes = notesStorage.value.notes.filter(note => note.id !== notesStorage.value.active?.id)
        notesStorage.value.active = null
        popups.delete = false
    }
}

</script>

<style scoped>
#text {
    min-width: 400px;
    min-height: 300px;
}

.action-button {
    border: 1px solid black;
    padding: 5px;
    background: white;
    cursor: pointer;

}

#buttons {
    display: flex;
    gap: 2px;
}

.popup {
    border: 1px solid black;
    padding: 10px;
    min-width: 50%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    text-align: center;
    background-color: white;
}

.popup-buttons {
    border-top: 1px solid black;
    width: 100%;
    padding-top: 10px;
    display: flex;
    justify-content: space-evenly;
}

#active-note-name {
    position: absolute;
    z-index: 999;
    padding: 10px;
    width: 100px;
    right: -130px;
    border: 1px solid black;
    margin: 5px;
    background-color: white;
}
</style>