<template>
    <div class="fondo min-vh-100">
        <TicketForm />
        <TicketTable />
    </div>
</template>

<script setup>
    import TicketForm from './registros/TicketForm.vue';
    import TicketTable from './listas/TicketTable.vue';
</script>