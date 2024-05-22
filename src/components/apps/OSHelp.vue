<template>
    <Window>
        <template #topbar>
            <slot name="topbar"></slot>
        </template>

        <template #window>
            <p id="help">
                <b class="title">Read Me!</b>
                <b class="title">This application works best with bigger screens.</b>
                <span>You can access applications clicking in the icon on the bottom-left of the bar.</span>
                <span>When an app has opened it will appear on the screen, depending on your internet connection it could take a bit of time to load.</span>
                <span>You can close apps by clicking on the X on the top-right of each window</span>

                <span>There is a completely functional file system and a terminal inspired by those present in GNU/Linux distros</span>
            </p>
        </template>
    </Window>
</template>

<script setup lang="ts">
import Window from '../Window.vue';
</script>

<style scoped>

#help {
    min-width: 300px;
    min-height: 400px;
    max-width: 600px;
    max-height: 600px;
    text-align: left;
    background-color: white;
    margin: 0px;
    resize: both;
    overflow: scroll;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.title {
    font-size: 1.3em;
    text-align: center;
}
</style>