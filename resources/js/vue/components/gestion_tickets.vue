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
                    <button class="btn btn-outline-dark" @click="descargarTicketsExcel">
                        Descargar Tickets (Excel)
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
                                    </div>
                                    <div class="col-md-6">
                                        <div>
                                            <label for="respuesta" class="text-dark">Respuesta:</label>
                                            <br>
                                            <textarea class="text-dark" type="respuesta" id="respuesta" v-model="form.respuesta" required />
                                        </div>
                                        <br>
                                    </div>
                                    <div class="col-md-6">
                                        <br>
                                        <div>
                                            <label for="estado" class="text-dark">Estado:</label>
                                            <select id="estado" v-model="form.estado" required>
                                                <option value="abierto">Abierto</option>
                                                <option value="cerrado">Cerrado</option>
                                                <option value="en_proceso">En proceso</option>
                                                <option value="cancelado">Cancelado</option>
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
    import { ref, onMounted, onBeforeUnmount } from 'vue';
    import * as XLSX from 'xlsx';

    export default {
        
        setup() {

            const descargarTicketsExcel = async () => {
                try {
                    const token = localStorage.getItem('auth_token'); // Obtener el token desde localStorage
                    if (!token) {
                        console.error('No se encontró el token de autenticación');
                        return;
                    }

                    const response = await fetch('/api/tickets/all', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`, // Incluir el token en el encabezado
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

                    // Calcular las fechas de la semana pasada
                    const hoy = new Date();
                    const inicioDeEstaSemana = new Date(hoy.setDate(hoy.getDate() - hoy.getDay())); // Inicio de esta semana
                    const finDeLaSemanaPasada = new Date(inicioDeEstaSemana.setDate(inicioDeEstaSemana.getDate() - 1)); // Fin de la semana pasada
                    const inicioDeLaSemanaPasada = new Date(finDeLaSemanaPasada.setDate(finDeLaSemanaPasada.getDate() - 6)); // Inicio de la semana pasada

                    // Filtrar los tickets de la semana pasada
                    const ticketsSemanaPasada = data.filter(ticket => {
                        const fechaCreacion = new Date(ticket.created_at);
                        return fechaCreacion >= inicioDeLaSemanaPasada && fechaCreacion <= finDeLaSemanaPasada;
                    });

                    if (ticketsSemanaPasada.length === 0) {
                        console.warn('No se encontraron tickets de la semana pasada');
                        alert('No se encontraron tickets de la semana pasada');
                        return;
                    }

                    const worksheetData = ticketsSemanaPasada.map(ticket => ({
                        Título: ticket.titulo,
                        Descripción: ticket.descripcion,
                        Estado: ticket.estado,
                        'Fecha de creación': ticket.created_at,
                        Respuesta: ticket.respuesta,
                        'Fecha de respuesta': ticket.updated_at,
                        'Usuario de envío': ticket.usuario_creacion,
                        'Usuario que respondió': ticket.usuario_respuesta,
                    }));

                    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
                    const workbook = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tickets');
                    XLSX.writeFile(workbook, 'tickets_semanapasada.xlsx');
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
            useListModel2('tickets');
            

            const { form, enviar, cancelar, editMode } =
            useFormModel('tickets', {
                titulo: '',
                descripcion: '',
                estado: 'en_proceso',
                usuario_creacion: window.appData.user.id,
                usuario_respuesta: window.appData.user.id,
                respuesta: '',
            });

            if (route.params.id) {
                fetchTicket(route.params.id); // Llamada a la nueva función fetchTicket
            }

            // Cambiar el nombre de la función para obtener ticket
            const fetchTicket = async (id) => {
                console.console.log("entré al fecthTicket");
                
                const ticket = await fetchPagina(id);
                
                // Asegúrate de que se asignen los valores correctos al formulario
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
                router.push({ name: 'gestion_tickets', params: { id } });
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
                enviar: enviarTicket,
                cancelar,
                editMode,
                editar,
                recargar,
                descargarTicketsExcel,
            };
        },
    };
</script>