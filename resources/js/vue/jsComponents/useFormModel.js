import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useGenericStore } from '../store/useGenericStore.js';

export function useFormModel(modelType, defaultForm) {
  const store = useGenericStore();
  const router = useRouter();
  const route = useRoute();

  store.setModelType(modelType);

  const form = ref({ ...defaultForm });

  const editMode = ref(route.params.id !== undefined);

  watch(() => route.params.id, (newId) => {
    if (newId === undefined) {
      Object.keys(defaultForm).forEach(key => {
        form.value[key] = defaultForm[key];
      });
      editMode.value = false;
    } else {
      editMode.value = true;
      const item = store.data.find(item => item.id === parseInt(newId));
      if (item) {
        Object.keys(defaultForm).forEach(key => {
          form.value[key] = item[key];
        });
      }
    }
  });

  onMounted(() => {
    if (editMode.value) {
      const item = store.data.find(item => item.id === parseInt(route.params.id));
      if (item) {
        Object.keys(defaultForm).forEach(key => {
          form.value[key] = item[key];
        });
      }
    }
  });

  const enviar = async (accion = 'creacion') => {
    try {
      window.location.reload();
      let modelId = null;
      let userId = null;
      let ticketId = null;
      const entidadAfectada = modelType;

      if (editMode.value) {
        try {
          console.log("Editando, ID de ruta:", route.params.id);
          modelId = route.params.id; // Obtén el ID de la ruta

          if (modelType === 'tickets') { // Verifica si el tipo de modelo es 'tickets'
            // Modificar los valores en el formulario según sea necesario
            // form.value.usuario_creacion = 123; // Cambiar a un valor específico
            form.value.usuario_respuesta = window.appData.user.id; // Cambiar a un valor específico
          }
          if(modelType === 'user'){
            
          }

          console.log(form.value);
          await store.actualizarItem(modelId, form.value); // Actualiza el elemento con los datos del formulario
          accion = 'modificacion'; // Acción para registro de historia
          console.log("Elemento actualizado exitosamente. ID:", modelId);
        } catch (error) {
          console.error("Error al actualizar el elemento:", error);
        }
      } else {
        try {
          const response = await store.agregarItem(form.value); // Realiza la creación del nuevo elemento
          const newItem = response.data; // Accede a los datos en la propiedad `data`
          console.log("Nuevo ítem creado:", newItem); // Muestra el nuevo ítem en consola
          modelId = newItem.id; // Obtiene el ID del nuevo elemento
          accion = 'creacion'; // Acción para registro de historia
          console.log("Elemento creado exitosamente. ID:", modelId);
        } catch (error) {
          console.error("Error al crear el elemento:", error);
        }
      }
      
  
      if (!modelId) {
        console.error("Error: el ID del modelo no está definido.");
        console.log(accion);
        return;
      }
  
      if (modelType === 'user') {
        userId = modelId;
      } else if (modelType === 'tickets') {
        ticketId = modelId;
      }
  
      console.log("ID de usuario:", userId);
      console.log("ID de ticket:", ticketId);
  
      await registrarHistoria({
        user_id: userId || null,
        ticket_id: ticketId || null,
        accion,
        entidad_afectada: entidadAfectada,
      });
    } catch (error) {
      console.error("Error procesando el formulario:", error);
    }
  };
  
  
  const registrarHistoria = async ({
    user_id = null,
    ticket_id = null,
    accion,
    entidad_afectada,
  }) => {
    try {

      if(entidad_afectada==='user'){
        entidad_afectada='usuarios';
      }

      const validActions = ['creacion', 'cambio_estado', 'modificacion'];
      if (!validActions.includes(accion)) {
        throw new Error(
          `El campo 'accion' debe ser uno de los siguientes valores: ${validActions.join(', ')}.`
        );
      }
      if (typeof entidad_afectada !== "string" || !entidad_afectada.trim()) {
        throw new Error("El campo 'entidad_afectada' debe ser un texto válido.");
      }
  
      const historiaData = {
        accion,
        descripcion: `${accion} realizada en ${entidad_afectada}`,
        entidad_afectada,
        usuario_modificado_id: user_id,
        tickets_id: ticket_id,
        user_id: window.appData.user.id,
      };
      
      console.log("Datos enviados al modelo historias:", historiaData);
  
      const historiaStore = useGenericStore();
      historiaStore.setModelType('historias');
      await historiaStore.agregarItem(historiaData);
    } catch (error) {
      console.error("Error registrando en el modelo historias:", error);
    }
  };
  
  
  

  const cancelar = () => {
    router.push({name:'gestion_usuarios'});
    // router.push({ name: `Tabla${modelType.charAt(0).toUpperCase() + modelType.slice(1).replace(/_/g, '')}` });
  };

  return {
    form,
    enviar,
    cancelar,
    editMode,
  };
}
