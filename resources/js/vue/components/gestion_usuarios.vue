<template>
    <div>
        <!-- Tabla de usuarios -->
        <table>
        <thead>
            <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Contraseña</th>
            <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in data" :key="item.id">
            <td>{{ item.name }}</td>
            <td>{{ item.email }}</td>
            <td>{{ item.rol }}</td>
            <td>{{ item.password }}</td>
            <td>
                <!-- Botón de editar -->
                <button @click="editar(item.id)">Editar</button>
            </td>
            </tr>
        </tbody>
        </table>

        <!-- Formulario de registro/edición de usuario -->
        <form @submit.prevent="enviar(editMode ? 'modificacion' : 'creacion')">
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

            // Para la lista de usuarios
            const { data, isLoading, pagination, fetchPagina, eliminar, search, buscar } = useListModel('user');

            // Para el formulario de creación/edición de usuario
            const { form, enviar, cancelar, editMode } = useFormModel('user', {
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
            rol: 'usuario', // Valor por defecto
            });

            // Cargar el usuario a editar si estamos en modo de edición
            if (route.params.id) {
                fetchUser(route.params.id);
            }

            const fetchUser = async (id) => {
                const user = await fetchPagina(id); // Asume que `fetchPagina` puede tomar un ID para obtener un solo usuario
                form.name = user.name;
                form.email = user.email;
                form.password = ''; // Dejar vacío para que el usuario lo cambie si lo desea
                form.password_confirmation = ''; // Lo mismo que para la contraseña
                form.rol = user.rol;
            };

            // Función para enviar el formulario (registrar o actualizar)
            const enviarUsuario = async (accion) => {
                try {
                    await enviar(accion); // Enviar el formulario
                    window.location.reload();
                } catch (error) {
                    console.error('Error al enviar el usuario:', error);
                }
            };

            // Función para editar un usuario
            const editar = (id) => {
                router.push({ name: 'gestion_usuarios', params: { id } }); // Redirigir a la página de edición
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
            enviar: enviarUsuario,
            cancelar,
            editMode,
            editar,
            };
        },
    };
</script>
  