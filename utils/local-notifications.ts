import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export type SimpleAppointment = {
    id: number;
    pacienteEmail: string;
    fecha: string; // YYYY-MM-DD
    hora: string;  // HH:MM
    procedimiento: string;
    estado: string;
};

/**
 * Solicita los permisos necesarios para mostrar notificaciones en el dispositivo.
 */
export async function requestNotificationPermissions(): Promise<boolean> {
    if (Platform.OS === 'web') return false;

    try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.log('Permisos para notificaciones locales rechazados.');
            return false;
        }

        // Configuración adicional requerida para Android
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'Recordatorios',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#e83e8c',
            });
        }

        return true;
    } catch (error) {
        console.error('Error solicitando permisos de notificación:', error);
        return false;
    }
}

/**
 * Cancela todos los recordatorios programados y vuelve a programar recordatorios
 * personalizados para las próximas citas del usuario.
 * 
 * - Recordatorio 1: El día anterior a la cita a las 8:00 PM (20:00).
 * - Recordatorio 2: El mismo día de la cita 2 horas antes de la cita.
 */
export async function syncAllAppointmentReminders(
    appointments: SimpleAppointment[],
    userEmail: string
) {
    if (Platform.OS === 'web') return;

    try {
        // 1. Verificar si tenemos permisos
        const hasPermission = await requestNotificationPermissions();
        if (!hasPermission) return;

        // 2. Cancelar todas las notificaciones programadas anteriormente para esta app
        await Notifications.cancelAllScheduledNotificationsAsync();

        const now = new Date();
        const patientAppointments = appointments.filter(app => 
            app.pacienteEmail && 
            app.pacienteEmail.toLowerCase() === userEmail.toLowerCase() &&
            (app.estado === 'pendiente' || app.estado === 'confirmada')
        );

        for (const app of patientAppointments) {
            // Parsear fecha y hora localmente de manera segura (evitando desfases de huso horario)
            const [year, month, day] = app.fecha.split('-').map(Number);
            const [hour, minute] = app.hora.split(':').map(Number);
            const appointmentDate = new Date(year, month - 1, day, hour, minute);

            // Formato amigable de fecha para el texto de la notificación (DD/MM/AAAA)
            const formattedDate = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;

            // --- RECORDATORIO 1: El día anterior a las 8:00 PM (20:00) ---
            const reminder1Date = new Date(appointmentDate);
            reminder1Date.setDate(reminder1Date.getDate() - 1);
            reminder1Date.setHours(20, 0, 0, 0); // Fija hora a las 8:00 PM

            if (reminder1Date.getTime() > now.getTime()) {
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: 'Recordatorio de Cita',
                        body: `Mañana a las ${app.hora} tienes tu cita de ${app.procedimiento}. ¡No olvides asistir!`,
                        data: { appointmentId: app.id, type: 'day_before' },
                    },
                    trigger: {
                        type: Notifications.SchedulableTriggerInputTypes.DATE,
                        date: reminder1Date,
                    },
                });
            }

            // --- RECORDATORIO 2: El mismo día, 2 horas antes de la cita ---
            const reminder2Date = new Date(appointmentDate);
            reminder2Date.setHours(reminder2Date.getHours() - 2);

            if (reminder2Date.getTime() > now.getTime()) {
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: 'Tu cita es pronto',
                        body: `Recuerda que en 2 horas (a las ${app.hora}) tienes tu cita de ${app.procedimiento}.`,
                        data: { appointmentId: app.id, type: 'two_hours_before' },
                    },
                    trigger: {
                        type: Notifications.SchedulableTriggerInputTypes.DATE,
                        date: reminder2Date,
                    },
                });
            }
        }
        
        console.log(`Recordatorios de citas sincronizados. Citas analizadas: ${patientAppointments.length}`);
    } catch (error) {
        console.error('Error sincronizando recordatorios locales:', error);
    }
}
