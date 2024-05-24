<template>
    <div id="comment" class="wotitem">
        {{ comment.body }}
    </div>
</template>

<script setup>
import { onMounted, ref, inject, defineProps } from 'vue'
import { useRoute } from 'vue-router'

const api = inject('axios')
const route = useRoute()

const props = defineProps({
    comment: Object
})

</script>

<style scoped>

</style>