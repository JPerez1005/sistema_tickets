<template>
    <div class="fondo min-vh-100">
        <div class="w-100 d-flex justify-center">
            <div class="col-md-6 d-flex justify-content-center mt-5">
                <!-- Button trigger modal -->
                <button type="button" class="btn btn-dark" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    Agregar
                </button>
            </div>
            <div class="col-md-6 d-flex justify-content-center mt-5">
                <button class="btn btn-dark" @click="descargarUsuariosExcel">
                    Descargar Usuarios (Excel)
                </button>
            </div>
        </div>
        <!-- Modal -->
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                    <h1 class="modal-title fs-5 text-dark" id="exampleModalLabel">Modal title</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <!-- Formulario de registro/edición de usuario -->
                        <form @submit.prevent="enviar(editMode ? 'modificacion' : 'creacion')">
                            
                            <div class="row">
                                <div class="col-md-6">
                                    <div>
                                        <label for="name" class="text-dark">Nombre:</label>
                                        <br>
                                        <input class="text-dark" type="text" id="name" v-model="form.name" required />
                                    </div>
                                    <br>
                                    <div>
                                        <label for="email" class="text-dark">Email:</label>
                                        <br>
                                        <input class="text-dark" type="email" id="email" v-model="form.email" required />
                                    </div>
                                    <br>
                                </div>
                                <div class="col-md-6">
                                    <div>
                                        <label for="password" class="text-dark">Contraseña:</label>
                                        <br>
                                        <input class="text-dark" type="password" id="password" v-model="form.password" required />
                                    </div>
                                    <br>
                                    <div>
                                        <label for="password_confirmation" class="text-dark">Confirmar Contraseña:</label>
                                        <br>
                                        <input class="text-dark" type="password" id="password_confirmation" v-model="form.password_confirmation" required />
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <br>
                                    <div>
                                        <label for="rol" class="text-dark">Rol:</label>
                                        <select id="rol" v-model="form.rol" required>
                                            <option value="administrador">Administrador</option>
                                            <option value="soporte">Soporte</option>
                                            <option value="usuario">Usuario</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <br>
                                    <button type="submit" class="btn btn-outline-dark">{{ editMode ? 'Actualizar' : 'Registrar' }}</button>
                                    <button type="button" class="btn btn-outline-dark" @click="recargar">cancelar</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <div class="container mt-5 d-flex justify-content-center align-items-center flex-column">
            <div v-if="isMobile" class="container mt-5 d-flex justify-content-center align-items-center flex-column">
                <!-- Campo de Búsqueda -->
                <div class="mb-3 w-100">
                    <!-- Input de búsqueda -->
                    <input
                        v-model="search"
                        placeholder="Buscar acciones"
                        class="form-control mb-3"
                    />
                </div>
                <!-- Cards -->
                <div class="row">
                    <div class="col-md-4" v-for="item in filteredData" :key="item.id">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">{{ item.name }}</h5>
                                <p class="card-text">{{ item.email }}</p>
                                <p class="card-text"><strong>Rol:</strong> {{ item.rol }}</p>
                                <p class="card-text"><strong>Creado en:</strong> {{ item.created_at }}</p>
                                <button class="btn btn-primary btn-sm edit-btn" @click="editar(item.id)">Editar</button>
                            </div>
                        </div>
                        <br>
                    </div>
                </div>
            </div>
            <div v-else id="container-tabla">
                
    
                <div id="tabla2" class="text-dark p-3">
                    <!-- Tabla con DataTables -->
                    <DataTable id="tabla" :columns="columns" :data="filteredData" :options="tableOptions" class="display w-100 text-light" />
                </div>
            </div>
    
            
        </div>
    </div>
</template>
  
<script setup>
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net';
import { useListModel, useFormModel } from '../jsComponents/conexionModelos.js';
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import * as XLSX from 'xlsx';
import { useRouter, useRoute } from 'vue-router';

DataTable.use(DataTablesCore);

const { data, isLoading, search } = useListModel('user');
const dataTable = ref([]);

const columns = [
    { data: 'name', title: 'Nombre' },
    { data: 'email', title: 'Correo Electrónico' },
    { data: 'rol', title: 'Rol' },
    { data: 'created_at', title: 'Fecha de Creación' },
    {
        title: 'Acciones',
        render: (data, type, row) => `
            <button class="btn btn-primary btn-sm edit-btn" @click="editar(item.id)">Editar</button>
            <button class="btn btn-danger btn-sm delete-btn" data-id="${row.id}">Eliminar</button>
        `
    }
];

const tableOptions = {
    pageLength: 3,
    lengthMenu: [3, 5, 10],
};

const filteredData = computed(() => {
    if (!search.value) return data.value;
    return data.value.filter((item) => {
        const searchLower = search.value.toLowerCase();
        return (
            item.name.toLowerCase().includes(searchLower) ||
            item.email.toLowerCase().includes(searchLower) ||
            item.rol.toLowerCase().includes(searchLower)
        );
    });
});

watch(filteredData, (newData) => {
    dataTable.value = newData;
});

const router = useRouter();
const route = useRoute();

const { form, enviar, cancelar, editMode, setForm } = useFormModel('user', {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    rol: 'usuario',
});

if (route.params.id) {
    fetchUser(route.params.id);
}

const fetchUser = async (id) => {
    const user = await fetchPagina(id);
    form.name = user.name;
    form.email = user.email;
    form.password = ''; 
    form.password_confirmation = ''; 
    form.rol = user.rol;
};


const enviarUsuario = async (accion) => {
    try {
        await enviar(accion);
        window.location.reload();
    } catch (error) {
        console.error('Error al enviar el usuario:', error);
    }
};

const editar = (id) => {
    router.push({ name: 'gestion_usuarios', params: { id } });
    const modal = new bootstrap.Modal(document.getElementById('exampleModal'));
    modal.show();
};

const isMobile = ref(false);
const checkScreenSize = () => {
    isMobile.value = window.innerWidth <= 1023;
};

onMounted(() => {
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', checkScreenSize);
});
</script>
