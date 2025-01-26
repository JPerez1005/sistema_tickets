<template>
    <div class="fondo min-vh-100">
        <UserTicketForm />
        <UserTicketTable />
    </div>
</template>
<script setup>
    import UserTicketForm from './registros/UserTicketForm.vue';
    import UserTicketTable from './listas/UserTicketTable.vue';
</script>