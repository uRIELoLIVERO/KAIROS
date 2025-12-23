// utils/timeSlotGenerator.js
/**
 * Genera turnos disponibles basados en franja horaria, duración y buffer
 */
export const generateAvailableSlots = ({
  startTime,
  endTime,
  duration,
  buffer = 0,
  bookedSlots = []
}) => {
  const slots = [];
  
  // Validar parámetros de entrada
  if (!startTime || !endTime) {
    console.error('startTime o endTime no están definidos:', { startTime, endTime });
    return slots;
  }
  
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  const totalDuration = duration + buffer;
  
  if (startMinutes >= endMinutes) {
    console.error('Hora de inicio debe ser menor que hora de fin:', { startTime, endTime });
    return slots;
  }
  
  // Filtrar bookedSlots válidos
  const validBookedSlots = bookedSlots.filter(slot => {
    if (!slot || !slot.startTime || !slot.endTime) {
      console.warn('Slot reservado inválido:', slot);
      return false;
    }
    return true;
  });
  
  let currentTime = startMinutes;
  
  while (currentTime + duration <= endMinutes) {
    const slotStart = minutesToTime(currentTime);
    const slotEnd = minutesToTime(currentTime + duration);
    
    // Verificar si este slot está reservado
    const isBooked = validBookedSlots.some(bookedSlot => {
      try {
        const bookedStart = timeToMinutes(bookedSlot.startTime);
        const bookedEnd = timeToMinutes(bookedSlot.endTime);
        return isTimeOverlap(
          currentTime,
          currentTime + duration,
          bookedStart,
          bookedEnd
        );
      } catch (err) {
        console.error('Error procesando slot reservado:', bookedSlot, err);
        return false;
      }
    });
    
    if (!isBooked) {
      slots.push({
        startTime: slotStart,
        endTime: slotEnd,
        duration: duration,
        buffer: buffer
      });
    }
    
    currentTime += totalDuration;
  }
  
  return slots;
};

/**
 * Convierte tiempo HH:MM a minutos desde medianoche
 */
const timeToMinutes = (time) => {
  if (!time) {
    console.error('timeToMinutes recibió tiempo indefinido');
    return 0;
  }
  
  // Si viene como Date object, convertirlo a string HH:MM
  if (time instanceof Date) {
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    time = `${hours}:${minutes}`;
  }
  
  // Asegurarse de que sea string
  const timeStr = String(time);
  
  // Manejar diferentes formatos
  let [hoursStr, minutesStr] = timeStr.split(':');
  
  if (!hoursStr || !minutesStr) {
    console.error('Formato de tiempo inválido:', time);
    return 0;
  }
  
  // Extraer solo números si hay letras u otros caracteres
  hoursStr = hoursStr.replace(/\D/g, '');
  minutesStr = minutesStr.replace(/\D/g, '');
  
  const hours = parseInt(hoursStr, 10) || 0;
  const minutes = parseInt(minutesStr, 10) || 0;
  
  return hours * 60 + minutes;
};

/**
 * Convierte minutos desde medianoche a tiempo HH:MM
 */
const minutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

/**
 * Verifica si dos intervalos de tiempo se solapan
 */
const isTimeOverlap = (start1, end1, start2, end2) => {
  return start1 < end2 && end1 > start2;
};