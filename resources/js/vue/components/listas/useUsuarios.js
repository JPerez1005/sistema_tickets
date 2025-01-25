import { computed } from 'vue';
import * as XLSX from 'xlsx';
import { useListModel } from '../../jsComponents/conexionModelos.js';

export function useUsuarios(modelName = 'user') {
    const { data, isLoading, search, eliminar } = useListModel(modelName);

    // Filtrar datos según el término de búsqueda
    const filteredData = computed(() => {
        if (!search.value) return data.value;
        const searchLower = search.value.toLowerCase();
        return data.value.filter(item => (
            item.name.toLowerCase().includes(searchLower) ||
            item.email.toLowerCase().includes(searchLower) ||
            item.rol.toLowerCase().includes(searchLower)
        ));
    });

    // Exportar datos a Excel
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredData.value);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Usuarios');
        XLSX.writeFile(workbook, 'usuarios.xlsx');
    };

    return {
        data,
        isLoading,
        search,
        filteredData,
        exportToExcel,
        eliminar,
    };
}
