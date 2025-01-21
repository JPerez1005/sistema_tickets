<template>
    <section class="bg-dark">
        
        <div class="row g-0">
            <div class="col-lg-7 d-none d-lg-block">
                <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="true">
                    <div class="carousel-indicators">
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                    </div>
                    <div class="carousel-inner">
                        <div class="carousel-item img-1 min-vh-100 active">
                            <!-- <img class="d-block w-100" :src="assetUrl" alt="imagen"> -->
                            <!-- Aquí no es necesario añadir la imagen ya que la estás mostrando arriba -->
                        </div>
                        <div class="carousel-item img-2 min-vh-100">
                            <!-- <img class="d-block w-100" :src="assetUrl" alt="imagen"> -->
                        </div>
                    </div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                    </button>
                </div>
            </div>
            <div class="col-lg-5">
                <div class="px-lg-5 pt-lg-4 pb-lg-3 p-4">
                    <!-- Otros contenidos -->
                </div>
                <div class="px-lg-5 py-lg-4 p-4">
                    <h1 class="mb-5">Bienvenido</h1>
                    <form @submit.prevent="submit">
                        <div class="mb-3">
                            <label for="exampleInputEmail1" class="form-label">Correo electronico</label>
                            <input type="email" class="form-control" placeholder="ingresa tu correo electronico" id="email" v-model="form.email" required/>
                            <div id="emailHelp" class="form-text text-light">no compartiremos tú correo con alguién mas.</div>
                        </div>
                        <div class="mb-5">
                            <label for="password" class="form-label">Contraseña</label>
                            <input type="password" class="form-control" placeholder="ingresa tú contraseña" id="password" v-model="form.password" required />
                        </div>
                        <button type="submit" class="btn btn-primary w-100 mt-10" native-type="submit">Enviar</button>
                    </form>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import axios from '../../axiosConfig.js';
import { useGenericStore } from '../../store/useGenericStore.js';

export default {
    data() {
        return {
            // assetUrl: "http://127.0.0.1:8000/imagenes/secretaria.jpg",
            form: {
                email: '',
                password: '',
            },
            errors: {
                login: ''
            }
        };
    },
    created() {
        console.log("estás autenticado?:" + this.$root.isLoggedIn);
        if (this.$root.isLoggedIn) {
            this.$router.push({ name: 'home' });
            return null;
        } else {
            this.$router.push({ name: 'login' });
        }
    },
    methods: {
        cleanErrorsForm() {
            this.errors.login = '';
        },
        submit() {
            alert("ingresando...");
            this.cleanErrorsForm();
            axios.get('/sanctum/csrf-cookie').then(() => {
                axios.post('/api/user/login', this.form).then(response => {
                    const token = response.data.token; // Guarda el token
                    console.log('Token obtenido:', token);

                    // Guarda el token en el Local Storage
                    localStorage.setItem('auth_token', token);
                    const genericStore = useGenericStore();
                    genericStore.setToken(token);

                    // Configura el encabezado de autorización globalmente
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                    // Ahora intenta acceder a /api/user
                    axios.get('/api/user').then(response => {
                        console.log('Usuario autenticado:', response.data);
                        this.$root.isLoggedIn = true;
                        window.location.href = '/vue#';
                    }).catch(error => {
                        console.log('Error al obtener usuario:', error.response.data);
                    });
                }).catch(error => {
                    console.log('Error en autenticación:', error.response.data);
                    this.errors.login = error.response.data;
                    alert("escribió algo mal");
                });
            });
        },
    },
};
</script>
