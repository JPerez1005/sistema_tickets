<template>

    <ul class="nav justify-content-center align-items-center" v-if="isLoggedIn">
      <!-- Opción general -->
      <li class="nav-item" v-if="user && user.rol === 'usuario'">
        <router-link :to="{name: 'gestion_tickets_usuarios'}" class="nav-link">Gestion Tickets (u)</router-link>
      </li>
    
      <!-- Opciones específicas para administradores -->
      
      <li class="nav-item" v-if="user && user.rol === 'administrador'">
        <router-link :to="{name: 'listas_historias'}" class="nav-link">Listas de historias</router-link>
      </li>
      <li class="nav-item" v-if="user && user.rol === 'administrador'">
        <router-link :to="{name: 'gestion_usuarios'}" class="nav-link">Gestión de Usuarios</router-link>
      </li>
    
      <!-- Opciones para administrador y soporte -->
      <li class="nav-item" v-if="user && (user.rol === 'administrador' || user.rol === 'soporte')">
        <router-link :to="{name: 'gestion_tickets'}" class="nav-link">Gestión de Tickets</router-link>
      </li>
    
      <!-- Opción de cerrar sesión -->
      <li class="nav-item">
        <a class="nav-link text-light" href="#" @click.prevent="logout">Cerrar sesión</a>
      </li>
    </ul>
  
    <router-view></router-view>
  </template>
  
  <script>
  import axios from './axiosConfig.js';
  import { useGenericStore } from './store/useGenericStore.js';
  import { useRouter, useRoute } from 'vue-router';
  
  export default {
    data() {
      return {
        isLoggedIn: false, // Inicializamos isLoggedIn
        user: null, // Definimos el usuario como null
        token: null,
      };
    },
    mounted() {
        console.log(window.appData);
        if (!window.appData || !window.appData.isLoggedIn) {
          localStorage.removeItem('auth_token');
          this.isLoggedIn = false;
          this.user = null;
          this.token = null;

        } else {
          this.isLoggedIn = window.appData.isLoggedIn;
          this.user = window.appData.user;
          this.token = window.appData.token;
        }
  
      // Verifica si hay un token en localStorage
      const token = localStorage.getItem('auth_token');
      if (token) {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
  
        axios.get('/api/user', config)
          .then(response => {
            console.log('Usuario autenticado:', response.data);
            this.isLoggedIn = true;
            this.user = response.data; // Asigna los datos del usuario
            this.token = token;
          })
          .catch(error => {
            console.log('Error al obtener el usuario:', error.response ? error.response.data : error.message);
          });
      } else {
        this.isLoggedIn = false;
        console.log('No hay token, el usuario no está autenticado.');
        this.$router.push({ name: 'login' });
      }
    },
    methods: {
      logout() {
        const token = localStorage.getItem('auth_token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        // Llamar al backend para cerrar sesión
        this.$axios.post('/api/user/logout', null, config)
          .then(() => {
            // Elimina el token del localStorage
            localStorage.removeItem('auth_token');
  
            // Actualiza el estado local del usuario en el frontend
            this.isLoggedIn = false;
            this.user = null;
            this.token = null;
  
            // Limpia window.appData
            window.appData = { isLoggedIn: false, user: null, token: null };
  
            console.log("Datos de appData después del logout:", window.appData);
            const genericStore = useGenericStore();
            genericStore.setToken(null);
            genericStore.removeToken();
            this.$root.isLoggedIn = false;
  
            // Redirige a la página de inicio o login
            this.$router.push({ name: 'login' });
          })
          .catch(error => {
            console.error("Error al cerrar sesión:", error.response ? error.response.data : error.message);
          });
      },
    },
    name: 'App',
  };
  </script>
  