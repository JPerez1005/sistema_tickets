<template>
  <form @submit.prevent="enviar">
    <div>
      <label for="titulo" class="text-dark">Titulo:</label>
      <input type="text" id="titulo" v-model="form.titulo" required />
    </div>
    <br>
    <div>
      <label for="descripcion" class="text-dark">Descripcion:</label>
      <textarea name="descripcion" id="descripcion" v-model="form.descripcion" required></textarea>
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
      estado: 'abierto',
      usuario_creacion: window.appData.user.id,
    });

    // Asignar el usuario autenticado al campo `usuario_creacion`
    if (window.appData && window.appData.user) {
      form.usuario_creacion = window.appData.user.id;
      console.log("usuario id: ",window.appData.user.id);
    }

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
