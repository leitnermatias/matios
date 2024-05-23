<script setup lang="ts">
import { ref, computed, shallowRef, onMounted } from "vue";
import ApplicationService, {Application} from "./service/applications"
import globalState from "./globalState";

import Configuration from "./components/apps/Configuration.vue"
import OSHelp from "@/components/apps/OSHelp.vue"

const configApp = ref({
  opened: false,
  showing: false,
  label: 'Configuration',
  title: 'Configuration',
  name: 'Configuration',
  icon: 'fa-cog',
  component: shallowRef(Configuration) 
})

const helpApp = ref({
  opened: false,
  showing: false,
  label: 'OS Help',
  title: 'How the System works',
  name: 'OS Help',
  icon: 'fa-regular-question-circle',
  component: shallowRef(OSHelp)
})

const showStartMenu = ref(false);

function startApp(app: Application) {
  ApplicationService.openApp(app);

  showStartMenu.value = false;
}

const staticApps = shallowRef<Application[]>([
  configApp.value,
  helpApp.value
])

const activeApps = computed<Application[]>(() => {
  return [
    ...ApplicationService.applications.filter(app => app.opened),
    ...staticApps.value
  ]
})

onMounted(() => {
  helpApp.value.opened = true
  helpApp.value.showing = true
})

</script>

<template>
  <div id="main" :style="globalState.mainStyles">
    <div id="viewport" :style="globalState.viewportStyles">
      <Transition name="fade">
        <div v-if="showStartMenu" id="start-menu">
          <div id="start-menu-buttons">
            <button @click="startApp(configApp)" class="start-menu-button"><v-icon name="fa-cog"></v-icon></button>
            <button @click="startApp(helpApp)" class="start-menu-button"><v-icon name="fa-regular-question-circle"></v-icon></button>
          </div>
          <span @click="startApp(app)" class="start-menu-app" v-for="app in ApplicationService.applications">
            <v-icon v-if="app.icon" :name="app.icon"></v-icon>{{ app.name }}
          </span>
        </div>
      </Transition>
      <TransitionGroup name="fade" appear>
        <component 
        v-for="app in activeApps" 
        v-show="app.showing"
        :key="app.name"
        :is="app.component"
        class="app-window" 
        >
          <template #topbar>
            <div class="app-topbar">
              <span><v-icon :name="app.icon"></v-icon> {{ app.name }}</span>
              <div>
                <v-icon @click="() => app.showing = false" class="app-topbar-icon" name="fa-minus"></v-icon>
                <v-icon @click="ApplicationService.closeApp(app)" class="app-topbar-icon" name="fa-window-close"></v-icon>
              </div>
            </div>
          </template>
        </component>
      </TransitionGroup>
      <a href="https://github.com/leitnermatias/matios" target="_blank" id="github-btn">
        <v-icon name="fa-github"></v-icon>
        Look at the code here!
      </a>
    </div>
    <div id="bottom-bar" :style="globalState.bottomNavStyles">
      <button @click="() => showStartMenu = !showStartMenu" id="start-button">
        <v-icon name="fa-brain" fill="#5cbeff"></v-icon>
      </button>
      <div id="applications">
        <TransitionGroup name="fade">
          <span 
          class="application" 
          :key="app.name"
          v-show="app.opened"
          v-for="app in [...ApplicationService.applications, ...staticApps]"
          @click="() => app.showing = !app.showing"
          ><v-icon :name="app.icon"></v-icon>  {{ app.label }}</span>
        </TransitionGroup>
      </div>
    </div>
  </div>
</template>

<style scoped>

@font-face {
  font-family: "Poppins";
  src: local("Poppins"),   url(./fonts/Poppins-Light.ttf) format("truetype");
}


#main {
  background: rgb(226, 226, 226);
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  font-family: "Poppins";
  font-size: 14px;
}

#viewport {
  background: linear-gradient(to bottom, #5cbeff77, #33b7f962);
  height: 90%;
}

#bottom-bar {
  background: rgba(191, 225, 250, 0.664);
  height: 10%;
  padding: 0px 10px;
  display: flex;
  align-items: center;
}

#start-button {
  padding: 10px;
  border: none;
  background: rgba(255, 255, 255, 0.74);
  cursor: pointer;
  border-radius: 100%;
}

#start-menu {
  position: absolute;
  display: flex;
  z-index: 99;
  flex-direction: column;
  padding: 5px;
  bottom: 10.5%;
  left: 5px;
  background: rgba(255, 255, 255, 0.454);
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.315);
  border-radius: 5px;
  width: 200px;
  height: 50%;
  overflow: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 47, 73, 0.308) rgba(255, 255, 255, 0.235);
}

#start-menu::-webkit-scrollbar {
  width: 8px;
}

#start-menu::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.235);
}

#start-menu::-webkit-scrollbar-thumb {
  background-color: rgba(0, 47, 73, 0.308);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.7s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

#start-button:hover {
  background: rgba(255, 255, 255, 0.9);
}

#applications {
  display: flex;
  gap: 5px;
  padding: 0px 10px;
}

.application {
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.201);
  padding: 10px;
  border-radius: 2px;
  cursor: pointer;
}

.application:hover {
  background: rgba(255, 255, 255, 0.281);
}

.start-menu-app {
  padding: 10px;
  background: rgba(255, 255, 255, 0.473);
  display: flex;
  color: rgb(0, 17, 64);
  align-items: center;
  gap: 10px;
  border-radius: 5px;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.372);
  cursor: pointer;
  margin: 2px 0px;
}

.start-menu-app:hover {
  background: rgba(255, 255, 255, 0.785);
  color: rgba(0, 2, 63, 0.566);
}

#start-menu-buttons {
  margin-bottom: 5px;
}

.start-menu-button {
  background: none;
  border: none;
  color: rgb(67, 169, 252);
  cursor: pointer;
}

.start-menu-button:hover {
  color: rgba(67, 169, 252, 0.541);
}

.app-topbar {
  background: white;
  display: flex;
  justify-content: space-between;
  background: rgba(191, 225, 250, 0.267);
  padding: 5px 10px;
}

.app-topbar-icon {
  color: rgb(0, 69, 106);
  cursor: pointer;
}

.app-topbar-icon:hover {
  color: rgb(120, 186, 248);
}

.app-window {
  border-radius: 2px;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.372);
  height:auto
}

#github-btn {
  text-decoration: none;
  color: inherit;
}
</style>
