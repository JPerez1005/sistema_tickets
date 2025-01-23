<template>
    <div id="carouselExampleIndicators" class="carousel slide mb-5" data-bs-ride="true">
        <div class="carousel-indicators">
            <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
        </div>
        <div class="carousel-inner">
            <div class="carousel-item img-3 min-vh-100 active">
                <div class="carousel-caption d-none d-md-block">
                    <h1>Sistema Automatizado</h1>
                    <p class="fw-bold">Bienvenido a nuestro sistema, {{ userName }}.</p>
                </div>
            </div>
            <div class="carousel-item img-4 min-vh-100">
                <div class="carousel-caption d-none d-md-block text-dark">
                    <h1>Tú eres importante para nosotros</h1>
                    <p>esperamos que con nuestros servicios podamos resolver tus dudas.</p>
                </div>
            </div>
            <div class="carousel-item img-5 min-vh-100">
                <div class="carousel-caption d-none d-md-block">
                    <h1>No te preocupes</h1>
                    <p>Nuestra seguridad protegerá todos tus datos y siempre trabajamos en mejorar.</p>
                </div>
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
</template>

<script>
export default {
  data() {
    return {
      userName: '',
    };
  },
  mounted() {
    if (window.appData && window.appData.user && window.appData.user.name) {
      this.userName = window.appData.user.name;
    }
  },
};
</script>