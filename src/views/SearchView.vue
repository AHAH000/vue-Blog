<!-- <script lang="ts">
import type{ PostList } from '@/types/type';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { listArticles } from './PostList.vue';
const articles = ref<any[]>([]);
const filteredBlogs = ref<PostList[]>([]);
const userId = parseInt(localStorage.getItem('userId') as string);
onMounted(async () => {
    articles.value = await listArticles();
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

</template>

<style scoped>


</style> -->