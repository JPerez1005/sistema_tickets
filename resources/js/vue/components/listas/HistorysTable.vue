<template>
    <!-- Botón de Exportación a Excel -->
    <button @click="exportToExcel" class=" mt-5 btn btn-light mb-3">Exportar a Excel</button>
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
                        <h5 class="card-title">{{ item.accion }}</h5>
                        <p class="card-text">{{ item.descripcion }}</p>
                        <p class="card-text"><strong>Entidad:</strong> {{ item.entidad_afectada }}</p>
                        <p class="card-text"><strong>Usuario Modificado:</strong> {{ item.usuario_modificado_id }}</p>
                        <p class="card-text"><strong>ID del Ticket:</strong> {{ item.tickets_id }}</p>
                        <p class="card-text"><strong>ID del Usuario:</strong> {{ item.user_id }}</p>
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
</template>
<script setup lang="ts">
    import DataTable from 'datatables.net-vue3'; // Importar el componente de DataTables para Vue 3
    import DataTablesCore from 'datatables.net'; // Importar la funcionalidad base de DataTables
    import { servicios } from './js/servicios.js';
    import { useScreenSize } from './js/useScreenSize.js';
    import { ref, computed, watch, onBeforeUnmount, onMounted } from 'vue';

    DataTable.use(DataTablesCore);

    const { data, isLoading, search, filteredData, exportToExcel } = servicios('historias'); // Datos desde el modelo
    const dataTable = ref([]); //datos predefinidos

    const { isMobile } = useScreenSize();

    const columns = [
    { data: 'accion', title: 'Acción', defaultContent: '' },
    { data: 'descripcion', title: 'Descripción', defaultContent: '' },
    { data: 'entidad_afectada', title: 'Entidad Afectada', defaultContent: '' },
    { data: 'usuario_modificado_id', title: 'Usuario Modificado', defaultContent: '' },
    { data: 'tickets_id', title: 'ID del Ticket', defaultContent: '' },
    { data: 'user_id', title: 'ID del Usuario', defaultContent: '' },
    { data: 'created_at', title: 'Fecha de Creación', defaultContent: '' },
    ];

    const tableOptions = {
        pageLength: 3, 
        lengthMenu: [3, 5, 10, 20, 50],
    };

</script>