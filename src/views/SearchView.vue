<!-- <script setup lang="ts">
import { importBlogs } from '@/util/methods';
import type { BLOG } from '@/util/types/types';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import PostList from './PostList.vue';
import 
const Blogs = ref<BLOG[]>([]);
const filteredBlogs = ref<BLOG[]>([]);
const route = useRoute();

const userId = parseInt(localStorage.getItem('userId') as string);

onMounted(async () => {
    Blogs.value = await importBlogs();
    console.log(route.query.q?.toString().toLowerCase());

    const searchQuery = route.query.q?.toString().toLowerCase() || '';
    filteredBlogs.value = Blogs.value.filter(blog =>
        blog.title.toLowerCase().includes(searchQuery) ||
        blog.content.toLowerCase().includes(searchQuery)
    );
    filteredBlogs.value.map(blog => {
        if (userId === blog.user?.id) {
            blog.editMode = true;
        }
    });
});
</script>

<template>
    <main class="display-home">
        <section class="home-body">
            <h1>Search Results</h1>
            <ListBlogs :blogs="filteredBlogs" />

        </section>

    </main>

</template>

<style scoped>
h1 {
    font-size: 1.5rem;
    font-weight: 700;
}

h2 {
    font-size: 1.25rem;
    font-weight: 600;
}

p {
    font-size: 0.75rem;
    font-weight: 400;
}

.display-home {
    display: flex;

    flex-direction: column;
}



.home-body {
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    width: 100%;
    background-color: var(--color-background-1);
}
</style> -->