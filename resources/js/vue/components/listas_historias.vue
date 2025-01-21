<template>
    <table>
        <thead>
          <tr>
            <th>Acción</th>
            <th>Descripción</th>
            <th>Entidad Afectada</th>
            <th>Usuario Modificado</th>
            <th>ID del Ticket</th>
            <th>ID del Usuario</th>
            <th>Fecha de Creación</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in data" :key="item.id">
            <td>{{ item.accion }}</td>
            <td>{{ item.descripcion }}</td>
            <td>{{ item.entidad_afectada }}</td>
            <td>{{ item.usuario_modificado_id }}</td>
            <td>{{ item.tickets_id }}</td>
            <td>{{ item.user_id }}</td>
            <td>{{ item.created_at }}</td>
          </tr>
        </tbody>
    </table>
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
      } = useListModel('historias');
  
  
      return {
        data,
        isLoading,
        pagination,
        fetchPagina,
        eliminar,
        search,
        buscar,
      };
    },
  };
  </script>
  