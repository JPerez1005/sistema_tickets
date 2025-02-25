import { defineStore } from 'pinia';
import axios from 'axios';
import $ from 'jquery';

export const useGenericStore = defineStore('generic', {
  state: () => ({
    data: [],
    isLoading: false,
    modelType: '',
    pagination: { total: 0, perPage: 10, currentPage: 1 },
    url: 'http://127.0.0.1:8000/api/',
    token: localStorage.getItem('auth_token') || '', // Recupera el token al inicializar
  }),
  actions: {
    setToken(newToken) {
      this.token = newToken;
      localStorage.setItem('auth_token', newToken); // Guarda el token en localStorage
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    },
    removeToken() {
      this.token = '';
      localStorage.removeItem('auth_token'); // Elimina el token de localStorage
      delete axios.defaults.headers.common['Authorization'];
    },
    setData(data) {
      this.data = data;
    },
    setModelType(modelType) {
      this.modelType = modelType;
    },
    async buscarYPaginar(page = 1, search = '') {
      this.isLoading = true;
      
      try {

        const token = localStorage.getItem('auth_token');
        if (!token) {
          console.error('Token no encontrado.');
          return;
        }

        const response = await axios.get(`/api/${this.modelType}/paginate`, {
          params: { page, search },
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log("entré");
    
            // Procesar los datos de la respuesta y asignarlos a la variable de datos
            this.data = response.data.data; // Ajusta según la estructura de tu respuesta
            this.pagination = {
                total: response.data.total,
                perPage: response.data.per_page,
                currentPage: response.data.current_page,
            };
        } catch (error) {
            // Manejo de errores, si el error es 401, redirigir al login
            if (error.response?.status === 401) {
                console.warn('No autorizado. Redirigiendo al inicio de sesión...');
                alert('No tienes permisos para realizar esta acción.');
                // window.location.href = '/vue#/login';
            } else {
                console.error('Error en buscarYPaginar:', error.response || error);
            }
        } finally {
            this.isLoading = false;
        }
    },
  
    async fetchData() {
      if (!this.modelType) {
        throw new Error("Model type is not set");
      }
    
      this.isLoading = true;
    
      try {
        const response = await axios.get(`${this.url}${this.modelType}/all`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });
    
        // Verifica que los datos están en response.data
        console.log('Datos obtenidos:', response.data);
    
        this.data = response.data || []; // Aquí asignamos los datos
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      } finally {
        this.isLoading = false;
      }
    }    
    ,
    async eliminarItem(id) {
      if (!this.modelType) throw new Error("Model type is not set");
    
      if (!this.token) {
        console.error('No se encontró el token en el estado global.');
        this.setData(null);
        window.location.href = '/vue#/login';
        return;
      }
    
      try {
        await axios.delete(`${this.url}${this.modelType}/${id}`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });
    
        // Filtrar los datos locales para eliminar el item
        this.data = this.data.filter(item => item.id !== id);
      } catch (error) {
        console.error(`Error al eliminar ${this.modelType}:`, error);
      }
    },
    async actualizarItem(id, datos) {
      if (!this.token) {
        console.error('No se encontró el token en el estado global.');
        this.setData(null);
        window.location.href = '/vue#/login';
        return;
      }
    
      if (!this.modelType) {
        throw new Error("Model type is not set");
      }
    
      try {
        // Usando AJAX con jQuery para actualizar el item
        const response = await new Promise((resolve, reject) => {
          $.ajax({
            url: `${this.url}${this.modelType}/${id}`,
            type: 'PUT',
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
            data: JSON.stringify(datos), // Enviar los datos en formato JSON
            contentType: 'application/json',
            success: function (data) {
              resolve(data);
            },
            error: function (xhr) {
              // Si el código de estado es 401, redirigir al inicio de sesión
              if (xhr.status === 401) {
                console.warn('Usuario no autorizado, redirigiendo....');
                alert("no tienes permisos");
                window.location.href = '/vue#/login';
              } else {
                // Rechazar el error para manejarlo en el catch
                reject(new Error(`Error: ${xhr.status} - ${xhr.statusText}`));
              }
            },
          });
        });
    
        // Encontramos el índice del item y lo actualizamos con los nuevos datos
        const index = this.data.findIndex(item => item.id === id);
        if (index !== -1) {
          this.data[index] = response;
        }
      } catch (error) {
        console.error(`Error al actualizar ${this.modelType}:`, error);
      }
    }
    ,
    async agregarItem(datos) {
      if (!this.token) {
        console.error('No se encontró el token en el estado global.');
        this.setData(null);
        window.location.href = '/vue#/login';
        return;
      }
    
      if (!this.modelType) {
        throw new Error("Model type is not set");
      }
    
      try {
        console.log(`URL construida: ${this.url}${this.modelType}`);
        console.log(datos);
        
        const response = await new Promise((resolve, reject) => {
          $.ajax({
            url: `${this.url}${this.modelType}`,
            type: 'POST',
            data: JSON.stringify(datos),
            contentType: 'application/json',
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
            success: function (data) {
              resolve(data);
            },
            error: function (xhr) {
              // Si el código de estado es 401, redirigir al inicio de sesión
              if (xhr.status === 401) {
                console.warn('Usuario no autorizado, redirigiendo....');
                alert("no tienes permisos");
                window.location.href = '/vue#/login';
              } else {
                // Rechazar el error para manejarlo en el catch
                reject(new Error(`Error: ${xhr.status} - ${xhr.statusText}`));
              }
            },
          });
        });
    
        this.data.push(response);
    
        // Retorna el objeto `response` para que pueda ser usado por quien llame esta función
        return response;
      } catch (error) {
        console.error(`Error al agregar ${this.modelType}:`, error);
        throw error; // Asegúrate de propagar el error si algo falla
      }
    }
  },
  persist: true,
});

