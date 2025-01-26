<template>
    <div class="col-md-10 d-flex justify-content-end mt-5">
        <button class="btn btn-light" @click="exportToExcel">
            Descargar Tickets (Excel)
        </button>
    </div>
    <div class="container mt-5 d-flex justify-content-center align-items-center flex-column pb-5">
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
</template>

<script setup>
    import { useRouter } from 'vue-router';
    import DataTable from 'datatables.net-vue3';
    import DataTablesCore from 'datatables.net';
    import $ from 'jquery';
    import { useScreenSize } from './js/useScreenSize.js';
    import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
    import { servicios } from './js/servicios.js';
    
    DataTable.use(DataTablesCore);

    const { data, isLoading, search, filteredData, exportToExcel } = servicios('tickets');
    const dataTable = ref([]);

    const { isMobile } = useScreenSize();

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

    const router = useRouter();

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

    onMounted(() => {

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
        // Destruir DataTable para liberar recursos
        if ($.fn.DataTable.isDataTable('#tabla-tickets')) {
            $('#tabla-tickets').DataTable().destroy();
        }
    });
</script>