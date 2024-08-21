import axios from 'axios';
import { ref } from 'vue';
import router from '@/router';
const VITE_API_URL = 'https://interns-blog.nafistech.com/api';

export const isAuthenticated = ref<boolean>(false);
export const user = ref<any>(null);

export const getUser = async () => {
  try {
    const response = await axios.get(`${VITE_API_URL}/user`);
    user.value = response.data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    // Handle the error, possibly logging out the user
    // logout();
  }
};

const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  isAuthenticated.value = true;
  getUser(); // Fetch user details when the token is present
}



export const showAlreadyLogged = () => {
  router.push('/');
};

export const logout = () => {
  localStorage.removeItem('token');
  delete axios.defaults.headers.common['Authorization'];
  isAuthenticated.value = false;
  user.value = null;
  router.push('/LoginView');
};
