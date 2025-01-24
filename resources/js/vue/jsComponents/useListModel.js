import { ref, onMounted, computed } from './conexionModelos.js';
import { useGenericStore } from '../store/useGenericStore.js'; // Asegúrate de importar tu store correctamente

export function useListModel(modelType) {
  const store = useGenericStore();
  const search = ref('');

  store.setModelType(modelType);

  // Hacer la llamada para obtener los datos en el montaje del componente
  onMounted(() => {
    store.fetchData();
    console.log(store);
  });

  // Usamos `computed` para acceder a `store.data` de manera reactiva
  const data = computed(() => store.data);
  const isLoading = computed(() => store.isLoading);
  const pagination = computed(() => store.pagination);

  const fetchPagina = async (page) => {
    await store.fetchData(page, search.value);
  };

  const buscar = async () => {
    await store.fetchData(1, search.value);
  };

  const eliminar = async (id) => {
    if (confirm("¿Estás seguro de que deseas eliminar este elemento?")) {
      await store.eliminarItem(id);
      alert("Elemento eliminado con éxito");
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
  };
}
