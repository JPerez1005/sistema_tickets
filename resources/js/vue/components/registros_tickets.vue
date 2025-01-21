<template>
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
</template>

<script>
import { useFormModel } from '../jsComponents/conexionModelos.js';
import { useRoute } from 'vue-router';

export default {
  setup() {
    const route = useRoute();
    const { form, enviar, cancelar, editMode } = useFormModel('tickets', {
      titulo: '',
      descripcion: '',
      estado: 'abierto', // Cambié a 'abierto' como valor por defecto
    });

    // Función enviar (registrar o actualizar)
    const enviarTicket = async () => {
      try {
        const accion = editMode ? 'modificacion' : 'creacion'; // Definir acción según el modo
        await enviar(accion); // Enviar el formulario
      } catch (error) {
        console.error('Error al enviar el ticket:', error);
      }
    };

    return {
      form,
      enviar: enviarTicket,
      cancelar,
      editMode,
    };
  },
};
</script>
