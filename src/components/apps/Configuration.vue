<template>
    <Window>
        <template #topbar>
            <slot name="topbar"></slot>
        </template>

        <template #window>
            <div id="container">
                
        
                <div id="window">
                    <div id="left-nav">
                        <button class="config-button">Colors</button>
                    </div>
                    <div id="config">
                        <component :is="activeScreen?.component"></component>
                    </div>
                </div>
            </div>
        </template>
    </Window>
</template>

<script setup lang="ts">
import {computed, reactive, ref} from "vue"
import ColorConfig from "../ColorConfig.vue";
import Window from "../Window.vue";

const configScreens = reactive([
    {active: true, component: ColorConfig}
])

const activeScreen = computed(() => {
    return configScreens.find(screen => screen.active)
})

</script>

<style scoped>

#window {
    background-color: rgba(255, 255, 255, 0.612);
    width: 400px;
    height: 300px;
    display: flex;
    margin: 0;
    padding: 0
}

#left-nav {
    display: flex;
    flex-direction: column;
    width: 25%;
    padding: 5px;
}

.config-button {
    padding: 5px;
    background: rgba(162, 213, 255, 0.34);
    border: none;
    box-shadow: 0px 0px 1px black;
    cursor: pointer;
    border-radius: 2px;
}

.config-button:hover {
    background: rgba(136, 201, 253, 0.432);
}

#config {
    width: 75%;
    padding: 5px;
}
</style>