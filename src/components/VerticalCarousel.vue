<template>
    <div class="flex">
        <div class="card flex-1">
            <Carousel :value="posts" :numVisible="1" :numScroll="1" orientation="vertical" verticalViewPortHeight="330px" containerClass="flex items-center">
                <template #item="slotProps">
                    <div class="border border-surface-200 dark:border-surface-700 rounded m-2 p-4">
                        <div class="mb-4">
                            <div class="relative mx-auto">
                                <img src="../assets/images/b1.jpg" class="w-full rounded" />
                                <Tag :value="slotProps.data.category" severity="info" class="absolute" style="left:5px; top:5px" />
                            </div>
                        </div>
                        <div class="mb-4 font-medium">{{ slotProps.data.title }}</div>
                        <div class="text-sm">{{ slotProps.data.excerpt }}</div>
                    </div>
                </template>
            </Carousel>
        </div>
        <div class="carousel-container w-64 ml-4">
            <!-- Place the vertical carousel component here -->
            <Carousel :value="posts" :numVisible="1" :numScroll="1" orientation="vertical" verticalViewPortHeight="330px" containerClass="flex items-center">
                <template #item="slotProps">
                    <div class="border border-surface-200 dark:border-surface-700 rounded m-2 p-4">
                        <div class="mb-4">
                            <div class="relative mx-auto">
                                <img src="../assets/images/b1.jpg" class="w-full rounded" />
                                <Tag :value="slotProps.data.category" severity="info" class="absolute" style="left:5px; top:5px" />
                            </div>
                        </div>
                        <div class="mb-4 font-medium">{{ slotProps.data.title }}</div>
                        <div class="text-sm">{{ slotProps.data.excerpt }}</div>
                    </div>
                </template>
            </Carousel>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
//
const posts = ref([]);
//
</script>

<style scoped>
.carousel-container {
    /* Adjust the width and any other styling for the carousel container */
    width: 300px;
}
</style>
