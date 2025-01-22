import { ref, onMounted, computed } from 'vue';
import { useGenericStore } from './conexionModelos.js';
// import { ref, onMounted, computed, useGenericStore } from './conexionModelos.js';

export function useListModel2(modelType) {
  const store = useGenericStore();
  const search = ref('');

  store.setModelType(modelType);

  onMounted(() => {
    store.buscarYPaginar();
  });

  const data = computed(() => store.data);
  const isLoading = computed(() => store.isLoading);
  const pagination = computed(() => store.pagination);

  const fetchPagina = async (page) => {
    await store.buscarYPaginar(page, search.value); // Llamamos al nuevo método
  };

  const buscar = async () => {
    await store.buscarYPaginar(1, search.value); // Llamamos al nuevo método
  };

  const eliminar = async (id) => {
    if (confirm("¿Estás seguro de que deseas eliminar este elemento?")) {
      await store.eliminarItem(id);
      alert("Elemento eliminado con éxito");
    }
  };

    const fetchData = async (page = 1) => {
        try {
            const response = await fetch(`/api/users?page=${page}`);
            const data = await response.json();

            // Actualiza los datos y la paginación
            this.data = data.users;
            this.pagination = data.pagination;
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        }
    };


  return {
    data,
    isLoading,
    pagination,
    fetchPagina,
    eliminar,
    search,
    buscar,
    fetchData,
  };
}
