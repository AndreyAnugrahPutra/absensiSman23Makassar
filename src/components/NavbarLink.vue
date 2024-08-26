<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router'

const props = defineProps({
    to: {
        type: Object,
        required: true,
    },
    active: {
        type: Boolean,
    },
});

const classes = computed(() =>
    props.active
        ? 'inline-flex md:w-full gap-2 items-center p-2 border-2 border-indigo-400 bg-indigo-400 text-sm font-medium leading-5 text-white focus:outline-none focus:border-indigo-700 transition duration-150 ease-in-out rounded-md'
        : 'inline-flex md:w-full gap-2 items-center p-2 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300 transition duration-150 ease-in-out'
);
</script>

<template>
    <RouterLink :to="to" :class="classes">
        <slot />
    </RouterLink>
</template>
