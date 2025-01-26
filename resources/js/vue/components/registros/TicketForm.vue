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
                                    <label for="titulo" class="text-dark">Titulo:</label>
                                    <br>
                                    <input class="text-dark" type="text" id="titulo" v-model="form.titulo" required />
                                </div>
                                <br>
                                <div>
                                    <label for="descripcion" class="text-dark">Descripcion:</label>
                                    <br>
                                    <textarea class="text-dark" type="descripcion" id="descripcion" v-model="form.descripcion" required/>
                                </div>
                                <br>
                            </div>
                            <div class="col-md-6">
                                <div>
                                    <label for="respuesta" class="text-dark">Respuesta:</label>
                                    <br>
                                    <textarea class="text-dark" type="respuesta" id="respuesta" v-model="form.respuesta" required />
                                </div>
                                <br>
                            </div>
                            <div class="col-md-6">
                                <br>
                                <div>
                                    <label for="estado" class="text-dark">Estado:</label>
                                    <select id="estado" v-model="form.estado" required>
                                        <option value="abierto">Abierto</option>
                                        <option value="cerrado">Cerrado</option>
                                        <option value="en_proceso">En proceso</option>
                                        <option value="cancelado">Cancelado</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="col-md-6">
                                <br>
                                <button type="submit" class="btn btn-outline-dark">{{ editMode ? 'Actualizar' : 'Registrar' }}</button>
                                <button type="button" class="btn btn-outline-dark" @click="recargar">cancelar</button>
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

    const { form, enviar, cancelar, editMode, setForm } = useFormModel('tickets', {
        titulo: '',
        descripcion: '',
        estado: 'en_proceso',
        usuario_creacion: window.appData.user.id,
        usuario_respuesta: window.appData.user.id,
        respuesta: '',
    });

    const recargar = () => {
        window.location.reload();
    };
</script>