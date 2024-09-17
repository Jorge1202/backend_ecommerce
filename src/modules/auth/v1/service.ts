import { User } from '../../users/v1/model';  // Asegúrate de que tu modelo esté correctamente importado

class IdentityService {
  
  /**
   * Verifica si el usuario está registrado y si la sesión es válida.
   * @param userId - ID del usuario
   * @param deviceId - ID del dispositivo (si es necesario)
   * @returns Un objeto con información sobre la validez del login
   */
  async validateLogin(userId: string, deviceId: string) {
    try {
      // Aquí puedes implementar la lógica para validar si el usuario está registrado
    //   const user = await User.findById(userId);
      const user = {devices: ''};
      
      if (!user) {
        return { error: true, message: 'Usuario no encontrado', code: 404 };
      }
      
      // Si estás manejando sesiones por dispositivo, verifica el dispositivo
      if (deviceId && !user.devices.includes(deviceId)) {
        return { error: true, message: 'Dispositivo no autorizado', code: 403 };
      }
      
      return { error: false, message: 'Login válido', code: 200 };
      
    } catch (error) {
      console.error('[IdentityService] Error validating login:', error);
      return { error: true, message: 'Error al validar login', code: 500 };
    }
  }

  // Puedes agregar más métodos aquí según tus necesidades

}

export default new IdentityService();
