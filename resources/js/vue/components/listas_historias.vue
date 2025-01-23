<template>
  <div class="fondo min-vh-100">
          <div class="w-100 d-flex justify-content-center">
            <div class="container mt-5 d-flex justify-content-center align-items-center flex-column">
                <div class="row w-90">
                    <div class="col-md-4">
                        <button class="btn btn-dark" @click="descargarHistoriasExcel">
                            Descargar Historias (Excel)
                        </button>
                    </div>
                    <div class="col-md-4">
                        
                        <!-- Input de búsqueda -->
                        <input
                        v-model="search"
                        @input="buscar"
                        placeholder="Buscar acciones"
                        class="form-control mb-3"
                        />
                    </div>
                    <div class="col-md-4">
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
                <div v-if="isMobile" class="container mt-5 d-flex justify-content-center align-items-center flex-column">
                    <!-- Cards -->
                    <div class="row">
                        <div class="col-md-4" v-for="item in data" :key="item.id">
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
                <div v-else class="container mt-5 d-flex justify-content-center align-items-center flex-column">
                    <!-- Tabla -->
                    <table class="table table-bordered border-light table-success table-striped text-center w-75">
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

          const descargarHistoriasExcel = async () => {
              try {
                  const token = localStorage.getItem('auth_token'); // Obtener el token desde localStorage
                  if (!token) {
                      console.error('No se encontró el token de autenticación');
                      return;
                  }

                  const response = await fetch('/api/historias/all', {
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

                  const worksheetData = data.map(item => ({
                      Acción: item.accion,
                      Descripción: item.descripcion,
                      'Entidad Afectada': item.entidad_afectada,
                      'Usuario Modificado': item.usuario_modificado_id,
                      'ID del Ticket': item.tickets_id,
                      'ID del Usuario': item.user_id,
                      'Fecha de Creación': item.created_at,
                  }));

                  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
                  const workbook = XLSX.utils.book_new();
                  XLSX.utils.book_append_sheet(workbook, worksheet, 'Usuarios');
                  XLSX.writeFile(workbook, 'usuarios.xlsx');
              } catch (error) {
                  console.error('Error al generar el archivo Excel:', error);
              }
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
          useListModel2('historias');

          return {
              isMobile,
              data,
              isLoading,
              pagination,
              fetchPagina,
              eliminar,
              search,
              buscar,
              fetchData,
              descargarHistoriasExcel,
          };
      },
  };
</script>