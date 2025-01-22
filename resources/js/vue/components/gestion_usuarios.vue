<template>
    <div>
        <div class="container mt-5 ">
            <div class="w-100 d-flex justify-center">
                <div class="col-md-6 d-flex justify-content-center">
                    <!-- Button trigger modal -->
                    <button type="button" class="btn btn-outline-dark" data-bs-toggle="modal" data-bs-target="#exampleModal">
                        Agregar
                    </button>
                </div>
                <div class="col-md-6 d-flex justify-content-center">
                    <button class="btn btn-outline-dark" @click="descargarUsuariosExcel">
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
                <div class="row">
                    <div class="col-md-10">
                        <!-- Input de búsqueda -->
                        <input
                        v-model="search"
                        @input="buscar"
                        placeholder="Buscar usuarios"
                        class="form-control mb-3"
                        />
                    </div>
                    <div class="col-md-2">
                        <!-- Controles de paginación -->
                        <nav v-if="pagination.total > pagination.perPage">
                            <ul class="pagination">
                                <li
                                v-for="page in Math.ceil(pagination.total / pagination.perPage)"
                                :key="page"
                                :class="{ active: page === pagination.currentPage }"
                                class="page-item"
                                >
                                    <a @click.prevent="fetchPagina(page)" class="page-link" href="#">
                                        {{ page }}
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
                <div v-if="isMobile">
                    <!-- Cards -->
                    <div class="row">
                        <div class="col-md-4" v-for="item in data" :key="item.id">
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-title">{{ item.name }}</h5>
                                    <p class="card-text">{{ item.email }}</p>
                                    <p class="card-text"><strong>Rol:</strong> {{ item.rol }}</p>
                                    <button @click="editar(item.id)" class="btn btn-outline-dark"><i class="fa-solid fa-pen-to-square"></i></button>
                                    <button @click="eliminar(item.id)" class="btn btn-outline-danger" ><i class="fa-solid fa-trash"></i></button>
                                </div>
                            </div>
                            <br>
                        </div>
                    </div>
                    
                </div>
                <div v-else>
                    <!-- Tabla -->
                    <table class="table table-bordered border-light table-success table-striped text-center w-75">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Rol</th>
                                <th>Modificar</th>
                                <th>Eliminar</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in data" :key="item.id">
                                <td>{{ item.name }}</td>
                                <td>{{ item.email }}</td>
                                <td>{{ item.rol }}</td>
                                <td>
                                    <button @click="editar(item.id)" class="btn btn-outline-dark"><i class="fa-solid fa-pen-to-square"></i></button>
                                </td>
                                <td>
                                    <button @click="eliminar(item.id)" class="btn btn-outline-danger"><i class="fa-solid fa-trash"></i></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
        
                
            </div>
        </div>
    </div>
</template>
  
<script>
    import { useListModel2, useFormModel } from '../jsComponents/conexionModelos.js';
    import { useRouter, useRoute } from 'vue-router';
    import { ref, onMounted, onBeforeUnmount } from 'vue';
    import * as XLSX from 'xlsx';

    export default {
        setup() {

            const descargarUsuariosExcel = async () => {
                try {
                    const token = localStorage.getItem('auth_token'); // Obtener el token desde localStorage
                    if (!token) {
                        console.error('No se encontró el token de autenticación');
                        return;
                    }

                    const response = await fetch('/api/user/all', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}` // Incluir el token en el encabezado
                        },
                    });

                    if (!response.ok) {
                        console.error('Error en la respuesta de la API:', response.status, response.statusText);
                        return;
                    }

                    const data = await response.json();

                    if (!Array.isArray(data)) {
                        console.error('Los datos recibidos no son válidos:', data);
                        return;
                    }

                    const worksheetData = data.map(user => ({
                        Nombre: user.name,
                        Email: user.email,
                        Rol: user.rol,
                    }));

                    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
                    const workbook = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(workbook, worksheet, 'Usuarios');
                    XLSX.writeFile(workbook, 'usuarios.xlsx');
                } catch (error) {
                    console.error('Error al generar el archivo Excel:', error);
                }
            };

            const recargar = () => {
                console.log("Botón Cancelar presionado");
                
                const modal = new bootstrap.Modal(document.getElementById('exampleModal'));
                modal.hide();

                window.location.reload();
            };

            const isMobile = ref(false);

            // Función para detectar el tamaño de la pantalla
            const checkScreenSize = () => {
                isMobile.value = window.innerWidth <= 768; // 768px o el tamaño que prefieras
            };

            onMounted(() => {
                checkScreenSize(); // Verificar el tamaño al montar el componente
                window.addEventListener('resize', checkScreenSize); // Escuchar cambios en el tamaño
            });

            onBeforeUnmount(() => {
                window.removeEventListener('resize', checkScreenSize); // Limpiar el evento al desmontar
            });

            const router = useRouter();
            const route = useRoute();

            const { data, isLoading, pagination, fetchPagina, eliminar, search, buscar,fetchData } =
            useListModel2('user');

            const { form, enviar, cancelar, editMode } =
            useFormModel('user', {
                name: '',
                email: '',
                password: '',
                password_confirmation: '',
                rol: 'usuario', // Valor por defecto
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

            return {
                isMobile,
                data,
                isLoading,
                pagination,
                fetchPagina,
                eliminar,
                search,
                buscar,
                form,
                enviar: enviarUsuario,
                cancelar,
                editMode,
                editar,
                recargar,
                descargarUsuariosExcel,
            };
        },
    };
</script>