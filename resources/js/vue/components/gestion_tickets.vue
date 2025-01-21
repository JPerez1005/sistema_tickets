<template>
    <div>
        <!-- Tabla de tickets -->
        <table>
        <thead>
            <tr>
            <th>Título</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Fecha de Creación</th>
            <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
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
        </tbody>
        </table>

        <!-- Formulario de registro o edición de tickets -->
        <form @submit.prevent="enviar">
        <div>
            <label for="titulo">Titulo:</label>
            <input type="text" id="titulo" v-model="form.titulo" required />
        </div>
        <br>
        <div>
            <label for="descripcion">Descripcion:</label>
            <textarea name="descripcion" id="descripcion" v-model="form.descripcion" required></textarea>
        </div>
        <br>
        <div>
            <label for="estado">Estado:</label>
            <select id="estado" v-model="form.estado" required>
            <option value="abierto" selected>Abierto</option>
            <option value="en_proceso">En Proceso</option>
            <option value="cerrado">Cerrado</option>
            <option value="cancelado">Cancelado</option>
            </select>
        </div>
        <br>
        <button type="submit">{{ editMode ? 'Actualizar' : 'Registrar' }}</button>
        <button type="button" @click="cancelar">Cancelar</button>
        </form>
    </div>
</template>
  
<script>
import { useListModel, useFormModel } from '../jsComponents/conexionModelos.js';
import { useRouter, useRoute } from 'vue-router';

export default {
    setup() {
        const router = useRouter();
        const route = useRoute();

        // Para la lista de tickets
        const { data, isLoading, pagination, fetchPagina, eliminar, search, buscar } = useListModel('tickets');

        // Para el formulario de creación/edición de ticket
        const { form, enviar, cancelar, editMode } = useFormModel('tickets', {
        titulo: '',
        descripcion: '',
        estado: 'abierto', // Valor por defecto
        });

        // Cargar el ticket a editar si estamos en modo de edición
        if (route.params.id) {
        fetchTicket(route.params.id);
        }

        const fetchTicket = async (id) => {
        const ticket = await fetchPagina(id); // Asume que `fetchPagina` puede tomar un ID para obtener un solo ticket
        form.titulo = ticket.titulo;
        form.descripcion = ticket.descripcion;
        form.estado = ticket.estado;
        };

        // Función para enviar el formulario (registrar o actualizar)
        const enviarTicket = async () => {
        try {
            const accion = editMode ? 'modificacion' : 'creacion'; // Acción según el modo
            await enviar(accion); // Enviar el formulario
        } catch (error) {
            console.error('Error al enviar el ticket:', error);
        }
        };

        // Función para editar un ticket
        const editar = (id) => {
            router.push({ name: 'gestion_tickets', params: { id } }); // Redirigir a la página de edición
        };

        return {
        data,
        isLoading,
        pagination,
        fetchPagina,
        eliminar,
        search,
        buscar,
        form,
        enviar: enviarTicket,
        cancelar,
        editMode,
        editar,
        };
    },
};
</script>