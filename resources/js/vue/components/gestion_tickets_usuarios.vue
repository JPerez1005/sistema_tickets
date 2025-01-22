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
                                    <div class="col-md-12">
                                        <div>
                                            <label for="titulo" class="text-dark">Titulo:</label>
                                            <br>
                                            <input class="text-dark" type="text" id="titulo" v-model="form.titulo" required />
                                        </div>
                                        <br>
                                        <div>
                                            <label for="descripcion" class="text-dark">Descripcion:</label>
                                            <br>
                                            <textarea class="text-dark" type="descripcion" id="descripcion" v-model="form.descripcion" required/>
                                        </div>
                                        <br>
                                        <div>
                                            <label for="estado" class="text-dark">Estado:</label>
                                            <select id="estado" v-model="form.estado" required>
                                                <option value="abierto">Abrir</option>
                                                <option value="cancelado">Cancelar</option>
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

            <div class="container mt-5 d-flex justify-center align-items-center flex-column ">
                <div class="row">
                    <div class="col-md-10">
                        <!-- Input de búsqueda -->
                        <input
                        v-model="search"
                        @input="buscar"
                        placeholder="Buscar tickets por titulo"
                        class="form-control mb-3"
                        />
                    </div>
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
                <div v-if="isMobile">
                    <!-- Cards -->
                    <div class="row">
                        <div class="col-md-4" v-for="item in data" :key="item.id">
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-title">{{ item.titulo }}</h5>
                                    <p class="card-text">{{ item.descripcion }}</p>
                                    <p class="card-text">{{ item.respuesta }}</p>
                                    <label for="">Usuario:</label>
                                    <p class="card-text">{{ item.usuario_creacion }}</p>
                                    <label for="">Usuario que dió respuesta:</label>
                                    <p class="card-text">{{ item.usuario_respuesta }}</p>
                                    <p class="card-text"><strong>estado:</strong> {{ item.estado }}</p>
                                    <p class="card-text"><strong>fecha creacion:</strong> {{ item.created_at }}</p>
                                    <p class="card-text"><strong>fecha respuesta:</strong> {{ item.updated_at }}</p>
                                    <button @click="editar(item.id)" class="btn btn-outline-dark"><i class="fa-solid fa-pen-to-square"></i></button>
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
                                <th>Titulo</th>
                                <th>Descripcion</th>
                                <th>Estado</th>
                                <th>fecha creacion</th>
                                <th>respuesta</th>
                                <th>fecha respuesta</th>
                                <th>Usuario de envio</th>
                                <th>Usuario que respondió</th>
                                <th>Modificar</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in data" :key="item.id">
                                <td>{{ item.titulo }}</td>
                                <td>{{ item.descripcion }}</td>
                                <td>{{ item.estado }}</td>
                                <td>{{ item.created_at }}</td>
                                <td>{{ item.respuesta }}</td>
                                <td>{{ item.updated_at }}</td>
                                <td>{{ item.usuario_creacion }}</td>
                                <td>{{ item.usuario_respuesta }}</td>
                                <td>
                                    <button @click="editar(item.id)" class="btn btn-outline-dark"><i class="fa-solid fa-pen-to-square"></i></button>
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
import { ref, computed, onMounted, onBeforeUnmount ,watch } from 'vue';

export default {
    setup() {
        const recargar = () => {
            const modal = new bootstrap.Modal(document.getElementById('exampleModal'));
            modal.hide();
            window.location.reload();
        };

        const isMobile = ref(false);

        // Función para detectar el tamaño de la pantalla
        const checkScreenSize = () => {
            isMobile.value = window.innerWidth <= 768;
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

        const { data, isLoading, pagination, fetchPagina, eliminar, search, buscar, fetchData } =
            useListModel2('tickets');

        const { form, enviar, cancelar, editMode } =
            useFormModel('tickets', {
                titulo: '',
                descripcion: '',
                estado: 'abierto',
                usuario_creacion: window.appData.user.id,
            });

        if (route.params.id) {
            fetchTicket(route.params.id);
        }

        // Función para obtener un ticket específico
        const fetchTicket = async (id) => {
            const ticket = await fetchPagina(id);
            form.titulo = ticket.titulo;
            form.descripcion = ticket.descripcion;
            form.estado = ticket.estado;
            form.respuesta = ticket.respuesta;
            form.usuario_respuesta = window.appData.user.id;
        };

        const enviarTicket = async (accion) => {
            try {
                await enviar(accion);
                window.location.reload();
            } catch (error) {
                console.error('Error al enviar el ticket:', error);
            }
        };

        const editar = (id) => {
            router.push({ name: 'gestion_tickets_usuarios', params: { id } });
            const modal = new bootstrap.Modal(document.getElementById('exampleModal'));
            modal.show();
        };


        return {
            isMobile,
            data, // Usar los datos filtrados
            isLoading,
            pagination,
            fetchPagina,
            eliminar,
            search,
            buscar,
            form,
            enviar: enviarTicket,
            cancelar,
            editMode,
            editar,
            recargar,
        };
    },
};
</script>
