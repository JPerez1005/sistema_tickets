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
                <button class="btn btn-dark" @click="exportToExcel">
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

        <div class="container mt-5 d-flex justify-content-center align-items-center flex-column">
            <div v-if="isMobile" class="container mt-5 d-flex justify-content-center align-items-center flex-column">
                <!-- Campo de Búsqueda -->
                <div class="mb-3 w-100">
                    <!-- Input de búsqueda -->
                    <input v-model="search" placeholder="Buscar acciones" class="form-control mb-3" />
                </div>
                <!-- Cards -->
                <div class="row">
                    <div class="col-md-4" v-for="item in filteredData" :key="item.id">
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
            <div v-else id="container-tabla-tickets">


                <div id="tabla2" class="text-dark p-3">
                    <!-- Tabla con DataTables -->
                    <DataTable id="tabla-tickets" :columns="columns" :data="filteredData" :options="tableOptions"
                        class="display text-light" />
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
import $ from 'jquery';

DataTable.use(DataTablesCore);

const { data, isLoading, search } = useListModel('tickets');
const dataTable = ref([]);

const columns = [
    { data: 'titulo', title: 'Titulo' , defaultContent: ''},
    { data: 'descripcion', title: 'Descripción', defaultContent: '' },
    { data: 'estado', title: 'Estado', defaultContent: '' },
    { data: 'created_at', title: 'Fecha de Creación', defaultContent: '' },
    { data: 'updated_at', title: 'Fecha de Respuesta', defaultContent: '' },
    { data: 'respuesta', title: 'Respuesta', defaultContent: '' },
    { data: 'usuario_creacion', title: 'Usuario de envio', defaultContent: '' },
    { data: 'usuario_respuesta', title: 'Usuario que respondió', defaultContent: '' },
    {
        title: 'Acciones',
        render: (data, type, row) => `
            <button class="btn btn-primary btn-sm edit-btn" data-id="${row.id}"><i class="fa-solid fa-pen-to-square"></i></button>
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
            item.titulo.toLowerCase().includes(searchLower) ||
            item.descripcion.toLowerCase().includes(searchLower) ||
            item.estado.toLowerCase().includes(searchLower) ||
            item.created_at.toLowerCase().includes(searchLower) ||
            item.updated_at.toLowerCase().includes(searchLower) ||
            item.respuesta.toLowerCase().includes(searchLower) ||
            item.usuario_creacion.toLowerCase().includes(searchLower) ||
            item.usuario_respuesta.toLowerCase().includes(searchLower)
        );
    });
});

watch(filteredData, (newData) => {
    dataTable.value = newData;
});

const exportToExcel = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const startOfLastWeek = new Date(oneWeekAgo);
    startOfLastWeek.setDate(oneWeekAgo.getDate() - oneWeekAgo.getDay());
    startOfLastWeek.setHours(0, 0, 0, 0);

    const endOfLastWeek = new Date(startOfLastWeek);
    endOfLastWeek.setDate(startOfLastWeek.getDate() + 6);
    endOfLastWeek.setHours(23, 59, 59, 999);

    // Filtrar datos por fecha de creación dentro de la semana pasada
    const filteredByWeek = filteredData.value.filter((item) => {
        const createdAt = new Date(item.created_at);
        return createdAt >= startOfLastWeek && createdAt <= endOfLastWeek;
    });

    // Verificar si hay tickets de la semana pasada
    if (filteredByWeek.length === 0) {
        alert('No hay tickets de la semana pasada para exportar.');
        return; // Salir de la función si no hay datos
    }

    // Convertir los datos a formato adecuado para Excel
    const worksheet = XLSX.utils.json_to_sheet(filteredByWeek); // usar datos filtrados
    const workbook = XLSX.utils.book_new(); // crear un nuevo libro
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tickets Semana Pasada'); // agregar la hoja a un libro

    // Guardar el archivo
    XLSX.writeFile(workbook, 'tickets_semana_pasada.xlsx'); // nombrarlo
};

const router = useRouter();
const route = useRoute();

const { form, enviar, cancelar, editMode, setForm } = useFormModel('tickets', {
    titulo: '',
    descripcion: '',
    estado: 'en_proceso',
    usuario_creacion: window.appData.user.id,
    usuario_respuesta: window.appData.user.id,
    respuesta: '',
});

if (route.params.id) {
    fetchTicket(route.params.id);
}

const fetchTicket = async (id) => {
    console.console.log("entré al fecthTicket");
    
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
    router.push({ name: 'gestion_tickets', params: { id } });
    const modal = new bootstrap.Modal(document.getElementById('exampleModal'));
    modal.show();
};

const isMobile = ref(false);
const checkScreenSize = () => {
    isMobile.value = window.innerWidth <= 1023;
};

const recargar = () => {
    console.log("Botón Cancelar presionado");
    
    const modal = new bootstrap.Modal(document.getElementById('exampleModal'));
    modal.hide();

    window.location.reload();
};

onMounted(() => {
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    // Verificar si DataTable ya está inicializado
    if (!$.fn.DataTable.isDataTable('#tabla-tickets')) {
        // Inicializar DataTable
        $('#tabla-tickets').DataTable({
            columns,
            data: filteredData.value,
            ...tableOptions,
        });
    } else {
        // Si ya está inicializado, solo actualizar los datos
        const table = $('#tabla-tickets').DataTable();
        table.clear();
        table.rows.add(filteredData.value);
        table.draw();
    }

    // Delegar eventos de "Editar" y "Eliminar" al contenedor
    $('#tabla-tickets').on('click', '.edit-btn', function (event) {
        const id = $(this).data('id'); // Usar jQuery para obtener el atributo 'data-id'
        editar(id);
    });
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', checkScreenSize);
    // Destruir DataTable para liberar recursos
    if ($.fn.DataTable.isDataTable('#tabla-tickets')) {
        $('#tabla-tickets').DataTable().destroy();
    }
});


</script>