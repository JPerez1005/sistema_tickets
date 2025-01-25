<template>
    <div class="col-md-9 d-flex justify-content-end mb-5">
        <button class="btn btn-light" @click="exportToExcel">
            Descargar Usuarios (Excel)
        </button>
    </div>
    <div class="container mt-5 d-flex justify-content-center align-items-center flex-column mb-5">
        <div v-if="isMobile" class="container mt-5 d-flex justify-content-center align-items-center flex-column">
            <!-- Campo de Búsqueda -->
            <div class="mb-3 w-100">
                <input v-model="search" placeholder="Buscar acciones" class="form-control mb-3" />
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
                            <button class="btn btn-primary btn-sm edit-btn" @click="editar(item.id)"><i class="fa-solid fa-pen-to-square"></i></button>
                            <button @click="eliminar(item.id)" class="btn btn-danger btn-sm mx-5"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </div>
                    <br>
                </div>
            </div>
        </div>
        <div v-else id="container-tabla">
            <div id="tabla2" class="text-dark p-3">
                <DataTable id="tabla" :columns="columns" :data="filteredData" :options="tableOptions"
                    class="display w-100 text-light" />
            </div>
        </div>
    </div>
</template>

<script setup>
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net';
import { useUsuarios } from './useUsuarios.js';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import $ from 'jquery';
import { useRouter } from 'vue-router';
import { useScreenSize } from './useScreenSize.js';

const router = useRouter();
DataTable.use(DataTablesCore);

const { data, search, filteredData, exportToExcel, eliminar } = useUsuarios('user');
const { isMobile } = useScreenSize();

const columns = [
    { data: 'name', title: 'Nombre', defaultContent: '' },
    { data: 'email', title: 'Correo Electrónico', defaultContent: '' },
    { data: 'rol', title: 'Rol', defaultContent: '' },
    { data: 'created_at', title: 'Fecha de Creación', defaultContent: '' },
    {
        title: 'Acciones',
        render: (data, type, row) => `
            <div class="action-buttons">
                <button class="btn btn-primary btn-sm edit-btn" data-id="${row.id}">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button class="btn btn-danger btn-sm delete-btn" data-id="${row.id}">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `
    }
];

const tableOptions = {
    pageLength: 3,
    lengthMenu: [3, 5, 10],
    responsive: true,
};

const editar = (id) => {
    router.push({ name: 'gestion_usuarios', params: { id } });
    const modal = new bootstrap.Modal(document.getElementById('exampleModal'));
    modal.show();
};

onMounted(() => {

    if (!$.fn.DataTable.isDataTable('#tabla')) {
        $('#tabla').DataTable({
            columns,
            data: filteredData.value,
            ...tableOptions,
        });
    }

    $('#tabla').on('click', '.edit-btn', function () {
        const id = $(this).data('id');
        editar(id);
    });

    $('#tabla').on('click', '.delete-btn', function () {
        const id = $(this).data('id');
        eliminar(id);
    });
});

onBeforeUnmount(() => {
    if ($.fn.DataTable.isDataTable('#tabla')) {
        $('#tabla').DataTable().destroy();
    }
});
</script>
