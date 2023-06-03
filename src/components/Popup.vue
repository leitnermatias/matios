<template>
    <div id="popup">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
#popup {
    width: 100%;
    height: 92%;
    position: absolute;
    z-index: 999;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>