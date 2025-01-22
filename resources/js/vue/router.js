import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
import listas_tickets from "./components/listas_tickets.vue";
import registrar_tickets from "./components/registros_tickets.vue";
import listas_usuarios from "./components/listas_usuarios.vue";
import gestion_tickets_usuarios from "./components/gestion_tickets_usuarios.vue";
import listas_historias from "./components/listas_historias.vue";
import gestion_tickets from "./components/gestion_tickets.vue";
import gestion_usuarios from "./components/gestion_usuarios.vue";
// descomentar apenas obtenga seguridad con sanctum
import login from "./components/auth/LoginComponent.vue";

// Crear una constante para determinar el modo de historial
// Puedes cambiar entre `createWebHistory` y `createWebHashHistory` fácilmente
const useHashHistory = true; // Cambia a `true` si prefieres hash history

const routes = [
    {
        name: 'home',
        path: '/',
        redirect: '/vue'  // Redirigir la raíz a la ruta '/vue'
    },
    {
        name: 'listas_tickets',
        path: '/listas_tickets',
        component: listas_tickets
    },
    {
        name: 'registrar_tickets',
        path: '/registrar_tickets',
        component: registrar_tickets
    },
    {
        name: 'listas_usuarios',
        path: '/listas_usuarios',
        component: listas_usuarios
    },
    {
        name: 'gestion_tickets_usuarios',
        path: '/gestion_tickets_usuarios',
        component: gestion_tickets_usuarios
    },
    {
        name: 'listas_historias',
        path: '/listas_historias',
        component: listas_historias
    },
    {
        name: 'gestion_tickets',
        path: '/gestion_tickets',
        component: gestion_tickets
    },
    {
        name: 'gestion_usuarios',
        path: '/gestion_usuarios',
        component: gestion_usuarios
    },
    // descomentar apenas obtenga seguridad con sanctum
    {
        name: 'login',
        path: '/login',
        component: login
    },
];

const router = createRouter({
    history: useHashHistory ? createWebHashHistory() : createWebHistory(),
    routes,
});

export default router;