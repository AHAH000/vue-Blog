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
    articles.value = response.data.data.map((article: PostList) => ({
      title: article.title,
      content: article.content.substring(0, 100) + '...',
      slug: article.slug,
      Author: article.user.name,
      date: new Date(article.created_at).toLocaleDateString(),
      commentCount: article.comments_count,
      Image: article.image_thumb ,
      LatestComment: article.last_comment?.content,
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

    <!-- Container -->
    <div class="blog-container">
      <!-- Main blog cards -->
      <div class="blog-box-container">
        <!-- Loop through articles and create blog-box for each -->
        <div v-for="(article, index) in articles" :key="index" class="blog-box">
          <div class="blog-box-img">
            <!-- Conditionally display image or placeholder -->
            <img v-if="article.Image" :src="article.Image" alt="Article thumbnail " />
            <img v-else src="../assets/images/b2.jpg" alt="Article thumbnail placeholder" />
          </div>
          <div class="blog-box-text">
            <strong>
              <a href="#" @click.prevent="viewArticle(article.slug)">
                {{ article.title }}
              </a>
            </strong>
            
            <p>{{ article.content }}</p>
            <div class="blog-meta">
              <span class="articleDate">{{ article.date }}</span>
              <div class="blog-author-comments">
                <div class="blog-author">
                  <div class="blog-author-img">
                    <img alt="Placeholder author" src="../assets/images/b1.jpg" />
                  </div>
                  <div class="blog-author-text">
                    <strong>{{ article.Author }}</strong>
                  </div>
                </div>
                <div class="blog-comments">
                  {{ article.commentCount }} <i class="fa-solid fa-comment"></i>
                </div>
              </div>
            </div>
            
            <div class="latest-comment">
              <div class="comment-bubble">
                <div class="comment-avatar">
                  <img src="../assets/images/b1.jpg" alt="User Avatar" />
                </div>
                <div class="comment-content">
                  <strong>Latest Comment:</strong>
                  <p>{{ article.LatestComment || 'No comments yet' }}</p>
                </div>
              </div>
            </div>
            
            
            
            
          </div>
          <button @click.prevent="viewArticle(article.slug)" class="ReadBtn">Read More</button>
        </div><!-- End of blog-box -->

        <!-- Small cards -->
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
/* Common styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

a {
  text-decoration: none;
}

ul {
  list-style: none;
}

/* Blog section styles */
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

.blog-box-text {
  padding: 20px;
  flex: 1;
}

.blog-box-text strong {
  color: #0a0ef8;
  font-size: 1.2rem;
}
.blog-box-text strong:hover {
  color: #080bb1;
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

.blog-meta {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.articleDate {
  color: #797979;
  font-size: 0.8rem;
}

.blog-author-comments {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.blog-author {
  display: flex;
  align-items: center;
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

.blog-comments {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: #595959;
}

.blog-comments i {
  margin-left: 10px;
  color: #007bff;
  font-size: 1.5rem;
}

.latest-comment {
  margin-top: 20px;
  font-size: 0.9rem;
  color: #1e3a8a;
  display: flex;
  align-items: flex-start;
  justify-content: center; /* Center align the comment bubble */
}

.comment-bubble {
  position: relative;
  background: linear-gradient(135deg, #e0f2f1, #bbdefb);
  border: 1px solid #90caf9;
  border-radius: 12px;
  padding: 15px;
  width: 100%; /* Make the bubble fit the width of the card */
  max-width: 100%;
  font-size: 0.9rem;
  color: #1e3a8a;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 15px; /* Space between avatar and content */
  box-sizing: border-box; /* Ensure padding and border are included in width */
}

.comment-bubble::before {
  content: '';
  position: absolute;
  bottom: 100%;
  left: 20px;
  border-width: 10px;
  border-style: solid;
  border-color: transparent transparent #e0f2f1 transparent;
}

.comment-avatar {
  flex-shrink: 0;
}

.comment-avatar img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #bbdefb;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.comment-content {
  display: flex;
  flex-direction: column;
  max-width: calc(100% - 70px); /* Ensure content fits alongside avatar */
}

.comment-content strong {
  color: #1e3a8a;
  display: block;
  margin-bottom: 5px;
  font-size: 1rem;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.comment-content p {
  margin: 0;
  font-size: 0.9rem;
  color: #1e3a8a;
}

.latest-comment:hover .comment-bubble {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  transform: translateY(-5px);
}

.latest-comment:hover .comment-avatar img {
  border-color: #1e3a8a;
}

.ReadBtn {
  display: inline-block;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: bold;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}
.ReadBtn:hover {
  background-color: #0056b3;
  transform: scale(1.05);
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

.popup-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  z-index: 1000;
}
</style>
