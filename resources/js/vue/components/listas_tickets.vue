<template>
  <div class="container mt-5 ">
    <div class="container mt-5 d-flex justify-content-center align-items-center flex-column">
      <div class="row">
          <div class="col-md-10">
              <!-- Input de búsqueda -->
              <input
              v-model="search"
              @input="buscar"
              placeholder="Buscar tickets"
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
                          <!-- <p class="card-text">{{ item.email }}</p> -->
                          <!-- <p class="card-text"><strong>Rol:</strong> {{ item.rol }}</p> -->
                          <!-- <button @click="editar(item.id)" class="btn btn-outline-dark"><i class="fa-solid fa-pen-to-square"></i></button> -->
                          <!-- <button @click="eliminar(item.id)" class="btn btn-outline-danger" ><i class="fa-solid fa-trash"></i></button> -->
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
                      <th>Eliminar</th>
                  </tr>
              </thead>
              <tbody>
                  <tr v-for="item in data" :key="item.id">
                      <td>{{ item.titulo }}</td>
                      <td>{{ item.descripcion }}</td>
                      <td>{{ item.estado }}</td>
                      <td>{{ item.created_at }}</td>
                      <td>{{ item.respuesta }}</td>
                      <td>{{ item.fecha_respuesta }}</td>
                      <td>{{ item.usuario_creacion }}</td>
                      <td>{{ item.usuario_respuesta }}</td>
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


  <!-- <tr v-for="item in data" :key="item.id">
    <td>{{ item.titulo }}</td>
    <td>{{ item.descripcion }}</td>
    <td>{{ item.estado }}</td>
    <td>{{ item.created_at }}</td>
    <td>
      <button @click="editar(item.id)">Editar</button>
    </td>
  </tr> -->
</template>

<script>
import { useListModel2 } from '../jsComponents/conexionModelos.js';
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
      fetchData,
    } = useListModel2('tickets');

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
