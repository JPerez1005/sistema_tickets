<template>
    <form @submit.prevent="enviar('creacion')">
      <div>
        <label for="name">Nombre:</label>
        <input type="text" id="name" v-model="form.name" required />
      </div>
      <br>
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="form.email" required />
      </div>
      <br>
      <div>
        <label for="password">Contraseña:</label>
        <input type="password" id="password" v-model="form.password" required />
      </div>
      <br>
      <div>
        <label for="password_confirmation">Confirmar Contraseña:</label>
        <input type="password" id="password_confirmation" v-model="form.password_confirmation" required />
      </div>
      <br>
      <div>
        <label for="rol">Rol:</label>
        <select id="rol" v-model="form.rol" required>
          <option value="administrador">Administrador</option>
          <option value="soporte">Soporte</option>
          <option value="usuario">Usuario</option>
        </select>
      </div>
      <br>
      <button type="button" @click="enviar('creacion')">Registrar</button>
      <button type="button" @click="enviar('modificacion')">Actualizar</button>
      <button type="button" @click="cancelar">Cancelar</button>
    </form>
  </template>
  
<script>
  import { useFormModel } from '../jsComponents/conexionModelos.js';
  
  export default {
    setup() {
      const { form, enviar, cancelar, editMode } = 
      useFormModel('user', {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        rol: 'usuario',
      });
  
      return {
        form,
        enviar,
        cancelar,
        editMode,
      };
    },
  };
</script>