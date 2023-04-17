<script setup lang="ts">
import { ref } from "vue";
import ApplicationService, {Application} from "./service/applications"

const showStartMenu = ref(false);

function startApp(app: Application) {
  ApplicationService.openApp(app);

  showStartMenu.value = false;
}

</script>

<template>
  <div id="main">
    <div id="viewport">
      <Transition name="menu-fade">
        <div v-if="showStartMenu" id="start-menu">
          <span @click="startApp(app)" class="start-menu-app" v-for="app in ApplicationService.applications">
            <v-icon v-if="app.icon" :name="app.icon"></v-icon>{{ app.name }}
          </span>
        </div>
      </Transition>
        <component 
        v-for="app in ApplicationService.applications.filter(app => app.opened && app.showing)" 
        :is="app.component"
        class="app-window" 
        >
          <template #topbar>
            <div class="app-topbar">
              <span>{{ app.name }}</span>
              <div>
                <v-icon class="app-topbar-icon" name="fa-minus"></v-icon>
                <v-icon class="app-topbar-icon" name="fa-window-close"></v-icon>
              </div>
            </div>
          </template>
        </component>
    </div>
    <div id="bottom-bar">
      <button @click="() => showStartMenu = !showStartMenu" id="start-button">
        <v-icon name="fa-brain" fill="#5cbeff"></v-icon>
      </button>
      <div id="applications">
        <span class="application" v-for="app in ApplicationService.applications.filter(app => app.opened)">{{ app.label }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
#main {
  background: rgb(226, 226, 226);
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
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
  width: 20%;
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

.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: opacity 0.5s ease;
}

.menu-fade-enter-from,
.menu-fade-leave-to {
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
  background: rgb(224, 224, 224);
  padding: 10px;
  border-radius: 1px;
  cursor: pointer;
}

.application:hover {
  background: white;
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
}

.start-menu-app:hover {
  background: rgba(255, 255, 255, 0.785);
  color: rgba(0, 2, 63, 0.566);
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
}
</style>
