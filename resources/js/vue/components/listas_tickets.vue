<template>
  <tr v-for="item in data" :key="item.id">
    <td>{{ item.titulo }}</td>
    <td>{{ item.descripcion }}</td>
    <td>{{ item.estado }}</td>
    <td>{{ item.created_at }}</td>
    <td>
      <!-- Botón de editar -->
      <button @click="editar(item.id)">Editar</button>
    </td>
  </tr>
</template>

<script>
import { useListModel } from '../jsComponents/conexionModelos.js';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const {
      data,
      isLoading,
      pagination,
      fetchPagina,
      eliminar,
      search,
      buscar,
    } = useListModel('tickets');

    const editar = (id) => {
      router.push({ name: 'registrar_tickets', params: { id } }); // Usar el nombre actual de la ruta
    };


    return {
      data,
      isLoading,
      pagination,
      fetchPagina,
      eliminar,
      search,
      buscar,
      editar,
    };
  },
};
</script>
