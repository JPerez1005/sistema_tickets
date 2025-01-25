<template>
  <div class="fondo min-vh-100 pb-5">
    <UserForm />
    <UserTable />
  </div>
</template>
  
<script setup>
  import UserForm from './registros/UserForm.vue';
  import UserTable from './listas/UserTable.vue';
</script>