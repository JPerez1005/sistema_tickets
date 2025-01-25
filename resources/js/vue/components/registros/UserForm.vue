<template>
    <div class="w-100 d-flex justify-center">
        <div class="col-md-6 d-flex justify-content-center mt-5">
            <!-- Button trigger modal -->
            <button type="button" class="btn btn-dark" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Agregar
            </button>
        </div>
        
    </div>
    <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5 text-dark" id="exampleModalLabel">Modal title</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <!-- Formulario de registro/edición de usuario -->
                    <form @submit.prevent="enviar(editMode ? 'modificacion' : 'creacion')">

                        <div class="row">
                            <div class="col-md-6">
                                <div>
                                    <label for="name" class="text-dark">Nombre:</label>
                                    <br>
                                    <input class="text-dark" type="text" id="name" v-model="form.name" required />
                                </div>
                                <br>
                                <div>
                                    <label for="email" class="text-dark">Email:</label>
                                    <br>
                                    <input class="text-dark" type="email" id="email" v-model="form.email"
                                        required />
                                </div>
                                <br>
                            </div>
                            <div class="col-md-6">
                                <div>
                                    <label for="password" class="text-dark">Contraseña:</label>
                                    <br>
                                    <input class="text-dark" type="password" id="password" v-model="form.password"
                                        required />
                                </div>
                                <br>
                                <div>
                                    <label for="password_confirmation" class="text-dark">Confirmar
                                        Contraseña:</label>
                                    <br>
                                    <input class="text-dark" type="password" id="password_confirmation"
                                        v-model="form.password_confirmation" required />
                                </div>
                            </div>
                            <div class="col-md-6">
                                <br>
                                <div>
                                    <label for="rol" class="text-dark">Rol:</label>
                                    <select id="rol" v-model="form.rol" required>
                                        <option value="administrador">Administrador</option>
                                        <option value="soporte">Soporte</option>
                                        <option value="usuario">Usuario</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <br>
                                <button type="submit" class="btn btn-outline-dark">{{ editMode ? 'Actualizar' :
                                    'Registrar' }}</button>
                                <button type="button" class="btn btn-outline-dark"
                                    @click="recargar">cancelar</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useFormModel } from '../../jsComponents/conexionModelos.js';

const { form, enviar, cancelar, editMode, setForm } = useFormModel('user', {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    rol: 'usuario',
});

const recargar = () => {
    window.location.reload();
};
</script>