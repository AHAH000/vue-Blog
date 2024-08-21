<template>
    <div class="card">
        <Carousel :value="posts" :numVisible="3" :numScroll="1" :responsiveOptions="responsiveOptions">
            <template #item="slotProps">
                <div class="border border-surface-200 dark:border-surface-700 rounded m-2 p-4">
                    <div class="mb-4">
                        <div class="relative mx-auto">
                            <img :src="slotProps.data.image" :alt="slotProps.data.title" class="w-full rounded" />
                            <Tag :value="slotProps.data.category" severity="info" class="absolute" style="left:5px; top:5px" />
                        </div>
                    </div>
                    <div class="mb-4 font-medium">{{ slotProps.data.title }}</div>
                    <div class="text-sm">{{ slotProps.data.excerpt }}</div>
                </div>
            </template>
        </Carousel>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const posts = ref([]);

// onMounted(() => {
//     BlogService.getBlogPosts().then((data) => (posts.value = data));
// });

const responsiveOptions = ref([
    {
        breakpoint: '1400px',
        numVisible: 2,
        numScroll: 1
    },
    {
        breakpoint: '1199px',
        numVisible: 3,
        numScroll: 1
    },
    {
        breakpoint: '767px',
        numVisible: 2,
        numScroll: 1
    },
    {
        breakpoint: '575px',
        numVisible: 1,
        numScroll: 1
    }
]);
</script>
