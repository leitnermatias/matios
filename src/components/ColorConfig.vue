<template>
    <div class="container">
        <div class="field">
            <span class="field-label">
                Background
            </span>
            <input type="color" v-model="globalState.viewportStyles.background">
        </div>
        <div class="field">
            <span class="field-label">
                Bottom navigation bar
            </span>
            <input type="color" v-model="globalState.bottomNavStyles.background">
        </div>
        <div class="field">
            <span class="field-label">
                Font color
            </span>
            <input type="color" v-model="globalState.mainStyles.color">
        </div>
    </div>
</template>

<script setup lang="ts">
import globalState from '../globalState';
</script>

<style scoped>
#container {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
}

.field {
    display: flex;
    gap: 10px;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    margin: 5px 0px;
}

.field-label {
    width: 80%
}
</style>