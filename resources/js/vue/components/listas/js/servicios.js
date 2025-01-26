import { computed } from 'vue';
import * as XLSX from 'xlsx';
import { useListModel } from '../../../jsComponents/conexionModelos.js';

export function servicios(modelName) {
    const { data, isLoading, search, eliminar } = useListModel(modelName);

    // Filtrar datos según el término de búsqueda
    const filteredData = computed(() => {
        if (!search.value) return data.value;
        const searchLower = search.value.toLowerCase();

        return data.value.filter(item => {
            // Iterar dinámicamente sobre todas las propiedades del objeto
            return Object.values(item).some(value => {
                if (typeof value === 'string') {
                    return value.toLowerCase().includes(searchLower);
                }
                return false;
            });
        });
    });

    let exportToExcel;

    if(modelName=='tickets'){
        exportToExcel = () => {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
            const startOfLastWeek = new Date(oneWeekAgo);
            startOfLastWeek.setDate(oneWeekAgo.getDate() - oneWeekAgo.getDay());
            startOfLastWeek.setHours(0, 0, 0, 0);
    
            const endOfLastWeek = new Date(startOfLastWeek);
            endOfLastWeek.setDate(startOfLastWeek.getDate() + 6);
            endOfLastWeek.setHours(23, 59, 59, 999);
    
            // Filtrar datos por fecha de creación dentro de la semana pasada
            const filteredByWeek = filteredData.value.filter((item) => {
                const createdAt = new Date(item.created_at);
                return createdAt >= startOfLastWeek && createdAt <= endOfLastWeek;
            });
    
            // Verificar si hay tickets de la semana pasada
            if (filteredByWeek.length === 0) {
                alert('No hay tickets de la semana pasada para exportar.');
                return; // Salir de la función si no hay datos
            }
    
            // Convertir los datos a formato adecuado para Excel
            const worksheet = XLSX.utils.json_to_sheet(filteredByWeek); // usar datos filtrados
            const workbook = XLSX.utils.book_new(); // crear un nuevo libro
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Tickets Semana Pasada'); // agregar la hoja a un libro
    
            // Guardar el archivo
            XLSX.writeFile(workbook, 'tickets_semana_pasada.xlsx'); // nombrarlo
        };
    }else{
        exportToExcel = () => {
            const worksheet = XLSX.utils.json_to_sheet(filteredData.value);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, modelName); // Uso dinámico de modelName
            XLSX.writeFile(workbook, `${modelName}.xlsx`); // Nombre del archivo también dinámico
        };
    }


    
    

    return {
        data,
        isLoading,
        search,
        filteredData,
        exportToExcel,
        eliminar,
    };
}
