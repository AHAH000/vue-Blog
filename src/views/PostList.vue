<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { isAuthenticated } from '@/auth';
import Notification from '@/components/Notification.vue';
import Popup from '@/components/Popup.vue';
import axios from 'axios';
import type { PostList } from '@/types/type';

const showNotification = ref(false);
const notificationMessage = ref('');
const showPopup = ref(false);
const router = useRouter();
const VITE_API_URL = 'https://interns-blog.nafistech.com/api';

// Articles state
const articles = ref<any[]>([]);

const showLoginReminder = () => {
  notificationMessage.value = 'You must log in first';
  showNotification.value = true;
  setTimeout(() => {
    router.push('/LoginView');
  }, 2000);
};

const viewArticle = (slug: string) => {
  router.push(`/posts/${slug}`);
};

const listArticles = async () => {
  try {
    const response = await axios.get(`${VITE_API_URL}/posts`);
    articles.value = response.data.map((article: PostList) => ({
      title: article.title,
      content: article.content,
      slug: article.slug, // Add this line
      Author: article.user.name,
      date: new Date(article.created_at).toLocaleDateString()
    }));
  } catch (error) {
    console.error('Error Listing Articles:', error);
  }
};

onMounted(() => {
  if (!isAuthenticated.value) {
    showLoginReminder();
  } else {
    listArticles(); // Fetch articles if authenticated
  }
});
</script>

<template>
  <Notification v-if="showNotification" :message="notificationMessage" />
  <section id="blog">
    <div class="blog-heading">
      <strong>Recent Post</strong>
      <h3>Our Blog</h3>
    </div>

    <!--**container**************-->
    <div class="blog-container">
      <!-- **main blog cards** -->
      <div class="blog-box-container">
        <!-- Loop through articles and create blog-box for each -->
        <div v-for="(article, index) in articles" :key="index" class="blog-box">
          <div class="blog-box-img">
            <img alt="Placeholder image" src="../assets/images/b2.jpg" />
            <a href="#" class="blog-img-link">
              <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
          </div>
          <div class="blog-box-text">
            <strong><a href="#" @click.prevent="viewArticle(article.slug)">
              {{ article.title }}
            </a></strong>
            
            <p>{{ article.content }}</p>
            <div class="blog-author">
              <div class="blog-author-img">
                <img alt="Placeholder author" src="../assets/images/b1.jpg" />
              </div>
              <div class="blog-author-text">
                <strong>{{ article.Author }}</strong>
                <span>{{ article.date }}</span>
              </div>
            </div>
          </div>
        </div><!--box-end-->

        <!-- **small cards** -->
        <div class="small-cards-container">
          <!-- Add small card rendering here if needed -->
        </div>
      </div>
      
    </div>
    <div class="AddedBlog">
      <h2>Want To ADD Your Own Story</h2>
      <button @click="showPopup = true" class="addArticlebtn">Add Story</button>
    </div>
    <!-- Popup Component -->
    <Popup v-model:isVisible="showPopup" />
  </section>
</template>



<style scoped>
* {
  margin: 0;
  padding: 0;
  font-family: 'Poppins', sans-serif;
  box-sizing: border-box;
}

a {
  text-decoration: none;
}

ul {
  list-style: none;
}

/*==blog========================*/
#blog {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 50px 0;
  background: linear-gradient(135deg, #f4f1ea 0%, #d9c8b3 50%, #b0c4de 100%);
}

.blog-heading h3 {
  font-size: 2.4rem;
  color: #252525;
  font-weight: 800;
  text-transform: uppercase;
  line-height: 2.4rem;
}

.blog-heading strong {
  color: #0a0ef8;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.3px;
}

.blog-container {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 90%;
  max-width: 1200px;
  flex-wrap: flex;
  gap: 20px;
}

.blog-box-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Three columns */
  gap: 20px;
  width: 100%;
}

.blog-box {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
}

.blog-box:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.blog-box-img {
  width: 100%;
  height: 200px;
  overflow: hidden;
  position:static;
}

.blog-box-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.3s ease;
}

.blog-box-img:hover img {
  transform: scale(1.05);
}

.blog-img-link {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  color: #252525;
}

.blog-box-text {
  padding: 20px;
  flex: 1; /* Ensure equal height */
}

.blog-box-text strong {
  color: #0a0ef8;
  font-size: 1.2rem;
}
.blog-box-text strong:hover {
  color: #080bb1;
  font-size: 1.2rem;
}

.blog-box-text a {
  font-size: 1.4rem;
  color: #252525;
  font-weight: 700;
  line-height: 1.6rem;
  margin: 10px 0;
  display: block;
}

.blog-box-text p {
  color: #595959;
  font-size: 0.9rem;
  line-height: 1.6rem;
  margin-bottom: 15px;
}

.blog-author {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.blog-author-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 10px;
}

.blog-author-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.blog-author-text {
  display: flex;
  flex-direction: column;
}

.blog-author-text strong {
  color: #252525;
  font-weight: 700;
}

.blog-author-text span {
  color: #797979;
  font-size: 0.8rem;
}

/* Small cards */
.small-cards-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.small-card {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #ddd;
  background-color: #fff;
  transition: box-shadow 0.3s ease;
}

.small-card img {
  width: 100%;
  height: 100px;
  object-fit: cover;
}

.small-card p {
  padding: 10px;
  color: #252525;
  font-size: 0.9rem;
  line-height: 1.4rem;
}

.small-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.AddedBlog {
  text-align: center;
  margin-top: 30px;
}

.addArticlebtn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 21px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.addArticlebtn:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

/* Responsive adjustments */
@media(max-width: 920px) {
  .blog-box-container {
    grid-template-columns: repeat(2, 1fr); /* Two columns on medium screens */
  }
}

@media(max-width: 600px) {
  .blog-box-container {
    grid-template-columns: 1fr; /* One column on small screens */
  }

  .blog-heading h3 {
    font-size: 1.6rem;
    line-height: 1.6rem;
  }

  .small-cards-container {
    display: none;
  }
}

</style>
