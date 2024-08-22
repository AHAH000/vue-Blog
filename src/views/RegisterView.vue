<script setup lang="ts">
import { ref, computed } from 'vue';
import axios from 'axios';
import Notification from '@/components/Notification.vue';
import { type Register } from '@/types/type';
import router from '@/router';
import { isAuthenticated, showAlreadyLogged} from '@/auth';
// Define the API URL
const VITE_API_URL = 'https://interns-blog.nafistech.com/api';

// Form fields
const notificationMessage = ref('');
const showNotification = ref(false);
const step = ref(1);
const form = ref({
  email: '',
  name: '',
  password: '',
  confirmPassword: '',
});
const submissionError = ref('');

// Regular expression for basic email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;



if(isAuthenticated.value){
  showAlreadyLogged()
}

// Calculate the progress percentage
const progress = computed(() => {
  return (step.value / 3) * 100;
});

const nextStep = () => {
  if (step.value === 1) {
    if (!form.value.email) {
      showNotification.value = true;
      notificationMessage.value = 'Email is required';
      return;
    }
    if (!emailRegex.test(form.value.email)) {
      showNotification.value = true;
      notificationMessage.value = 'Enter a correct email address';
      return;
    }
  }
  if (step.value === 2 && !form.value.name) {
    showNotification.value = true;
    notificationMessage.value = 'Name is required';
    return;
  }
  if (step.value === 3 && (form.value.password !== form.value.confirmPassword)) {
    showNotification.value = true;
    notificationMessage.value = 'Passwords do not match';
    return;
  }
  submissionError.value = '';
  step.value++;
};

const prevStep = () => {
  step.value--;
};

const handleSubmit = async () => {
  const newUser: Register = {
    email: form.value.email,
    name: form.value.name,
    password: form.value.password,
    password_confirmation: form.value.confirmPassword,
  };

  try {
    const result = await axios.post(`${VITE_API_URL}/register`, newUser);
    const token = result.data.token;
    if (token) {
      localStorage.setItem('token', token);
      // Set Authorization header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      showNotification.value = true;
      notificationMessage.value = `Registration successful!`;
    //   isAuth.value=true;
      router.push('/LoginView');
    } else {
      showNotification.value = true;
      notificationMessage.value = "Registration failed.";
    }
  } catch (error) {
    submissionError.value = 'Registration failed. Please try again.';
    console.error('Registration error:', error);
  }
};
</script>

<template>
  <div class="spacing"></div>
  <div class="multi-step-form">
    <Notification v-if="showNotification" :message="notificationMessage" @close="showNotification = false" />

    <!-- Progress Circles -->
    <div class="progress-circles">
      <div :class="['circle', { active: step === 1 }]">1</div>
      <div :class="['circle', { active: step === 2 }]">2</div>
      <div :class="['circle', { active: step === 3 }]">3</div>
    </div>
    
    <form @submit.prevent="handleSubmit">
      <div v-if="step === 1">
        <h2>Step 1: Enter Your Email</h2>
        <input
          type="email"
          id="email"
          v-model="form.email"
          required
        />
        <div v-if="showNotification && step === 1" class="error-message">
          {{ notificationMessage }}
        </div>
        <button type="button" @click="nextStep">Next</button>
      </div>

      <div v-if="step === 2">
        <h2>Step 2: Enter Your Name</h2>
        <input
          type="text"
          id="name"
          v-model="form.name"
          required
        />
        <button type="button" @click="prevStep">Previous</button>
        <button type="button" @click="nextStep">Next</button>
      </div>

      <div v-if="step === 3">
        <h2>Step 3: Enter Your Password</h2>
        <input
          type="password"
          id="password"
          v-model="form.password"
          required
        />
        <input
          type="password"
          id="confirmPassword"
          v-model="form.confirmPassword"
          required
        />
        <button type="button" @click="prevStep">Previous</button>
        <button type="submit">Register</button>
      </div>

      <div v-if="submissionError" class="error-message">
        {{ submissionError }}
      </div>
    </form>
    <div class="RouteLogin">
      Already have an account? <router-link to="/LoginView">Login</router-link>
    </div>
  </div>
</template>

<style scoped>

/* Form container styling */
.spacing {
  margin-bottom: 50px;
}
.multi-step-form {
  max-width: 800px; /* Increased max width for a wider form */
  width: 100%; /* Full width to adapt to container size */
  margin: 0 auto; /* Center horizontally */
  text-align: center;
  color: black;
  display: flex;
  flex-direction: column; /* Stack form elements vertically */
  justify-content: center; /* Center vertically */
  align-items: center; /* Center horizontally */
  min-height: 60vh; /* Reduced height to make the form shorter */
  background-color: #fff; /* Background color for the form */
  padding: 20px; /* Add padding for form spacing */
  border-radius: 10px; /* Rounded corners for the form container */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5), inset 0 0 10px rgba(0, 0, 0, 0.7); /* Outer and inner shadow for depth */
  border: 3px solid rgba(255, 255, 255, 0.3); /* Light border with some opacity */
  padding-top: 100px; /* Add extra padding to push the form down */
  margin-top: 100px;
  margin-bottom: 100px;
}

/* Adjust margin-top to ensure no overlap with fixed NavBar */
body {
  margin: 0;
  padding-top: 60px; /* Add padding equal to or slightly more than the NavBar height */
}

/* Input field styling */
input {
  display: block;
  margin: 10px 0; /* Add vertical margin */
  width: calc(100% - 22px); /* Full width minus padding */
  padding: 10px; /* Add padding for better spacing */
  border-radius: 4px; /* Rounded corners for inputs */
  border: 1px solid #444; /* Darker border for inputs */
  background-color: white; /* Dark background for inputs */
  color: black; /* White text color for inputs */
  font-size: 16px; /* Larger font size for better readability */
}

/* Button styling */
button {
  margin: 15px 5px; /* Add margin for spacing between buttons */
  padding: 20px 40px; /* Increase padding for larger button size */
  background-color: #007bff;
  color: white; /* White text color for buttons */
  border: none;
  border-radius: 22px; /* More rounded corners for buttons */
  cursor: pointer; /* Pointer cursor for buttons */
  font-size: 16px; /* Larger font size for better readability */
  font-weight: bold; /* Make the text bolder */
  transition: background-color 0.3s ease, transform 0.3s ease; /* Smooth transitions */
}

button:hover {
  background-color: #0056b3; /* Darker button color on hover */
  transform: scale(1.05); /* Slightly enlarge the button on hover */
}

/* Label styling */
label {
  font-size: larger;
  color: white;
}

/* Progress Circles Styles */
.progress-circles {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Three equal columns */
  align-items: center;
  width: 100%; /* Full width to align circles properly */
  margin-bottom: 80px; /* Space between progress circles and form */
  margin-left: 150px;
}

.circle {
  width: 80px; /* Increased diameter of the circle */
  height: 80px; /* Increased diameter of the circle */
  border-radius: 50%; /* Make it circular */
  background-color: #ddd; /* Default color for circles */
  display: flex;
  align-items: center;
  justify-content: center;
  color: black;
  font-weight: bold;
  transition: background-color 0.3s ease, border 0.3s ease;
  position: relative;
  z-index: 1; /* Ensure circles are above the line */
  font-size: x-large;
}

.circle.active {
  background-color: rgb(17, 106, 165); /* Color of the active circle */
  color: white;
}

.circle:not(:last-child) {
  margin-right: 40px; /* Increased space between circles */
}

/* Line between circles */
.progress-circles::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  width: 70%; /* Full width */
  height: 5px; /* Increased line thickness */
  background-color: #ddd; /* Default line color */
  z-index: 0;
  transition: background-color 0.3s ease; /* Smooth color transition */
  border-radius: 2px; /* Rounded corners for the line */
}

.circle:nth-child(1).active ~ .progress-circles::after {
  width: 33.33%; /* Line width up to the first step */
  background-color: rgb(17, 106, 165);; /* Line color up to the first step */
}

.circle:nth-child(2).active ~ .progress-circles::after {
  width: 66.66%; /* Line width up to the second step */
  background-color: rgb(17, 106, 165);; /* Line color up to the second step */
}

.circle:nth-child(3).active ~ .progress-circles::after {
  width: 100%; /* Full line width for all steps */
  background-color: rgb(17, 106, 165); /* Line color up to the third step */
}

.circle:nth-child(3) {
  margin-right: 0; /* Remove extra margin after the last circle */
}

.RouteLogin {
  margin-top: 20px; /* Optional: Add some space above the text */
}

.RouteLogin a {
  color: #20344f; /* Set the link color to green */
  text-decoration: none; /* Remove underline from the link */
}

.RouteLogin a:hover {
  text-decoration: underline; /* Add underline on hover */
}
</style>
