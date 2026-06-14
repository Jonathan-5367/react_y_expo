import { SideMenu } from '@/components/SideMenu';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { NotifBell } from '@/components/NotifBell';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View, Alert, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/store/auth';
import { useAppointments } from '@/store/appointments';
import { CalendarModal } from '@/components/CalendarModal';
import { DropdownSelector } from '@/components/DropdownSelector';

export default function AgendarCitasScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { user } = useAuth();
    const { addAppointment } = useAppointments();

    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);
    const [isHourDropdownVisible, setIsHourDropdownVisible] = useState(false);

    const isPatient = user?.rol !== 'administrador';

    const [pacienteNombre, setPacienteNombre] = useState(isPatient ? (user?.nombre || '') : '');
    const [pacienteTelefono, setPacienteTelefono] = useState(isPatient ? (user?.telefono || '') : '');
    const [pacienteEmail, setPacienteEmail] = useState(isPatient ? (user?.email || '') : '');
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [procedimiento, setProcedimiento] = useState('');

    const handleAgendar = () => {
        if (!pacienteNombre.trim() || !pacienteTelefono.trim() || !pacienteEmail.trim() || !fecha.trim() || !hora.trim() || !procedimiento.trim()) {
            Alert.alert('Campos requeridos', 'Por favor complete todos los campos.');
            return;
        }

        // Validate date format YYYY-MM-DD
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(fecha.trim())) {
            Alert.alert('Fecha inválida', 'La fecha debe estar en formato AAAA-MM-DD (ej: 2026-06-15).');
            return;
        }

        // Validate time format (HH:MM)
        const timeRegex = /^\d{2}:\d{2}$/;
        if (!timeRegex.test(hora.trim())) {
            Alert.alert('Hora inválida', 'La hora debe estar en formato de 24 horas HH:MM (ej: 14:30).');
            return;
        }

        addAppointment({
            pacienteNombre: pacienteNombre.trim(),
            pacienteTelefono: pacienteTelefono.trim(),
            pacienteEmail: pacienteEmail.trim().toLowerCase(),
            fecha: fecha.trim(),
            hora: hora.trim(),
            procedimiento: procedimiento.trim()
        });

        Alert.alert('Cita Agendada', 'La cita ha sido registrada con éxito en el sistema.', [
            { text: 'Aceptar', onPress: () => router.back() }
        ]);
    };

    return (
        <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
            <SideMenu visible={isMenuVisible} onClose={() => setIsMenuVisible(false)} />
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => setIsMenuVisible(true)} style={styles.menuButton}>
                    <Ionicons name="menu" size={32} color="#e83e8c" />
                </TouchableOpacity>
                <NotifBell />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <ThemedText type="title" style={styles.title}>Agendar Nueva Cita</ThemedText>
                    <ThemedText style={styles.subtitle}>Agenda tu cita de manera fácil y rápida.</ThemedText>
                </View>

                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <ThemedText style={styles.label}>Nombre completo del paciente:</ThemedText>
                        <TextInput
                            style={[styles.input, isPatient && styles.readOnlyInput]}
                            value={pacienteNombre}
                            onChangeText={setPacienteNombre}
                            editable={!isPatient}
                            placeholder="Nombre del Paciente"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <ThemedText style={styles.label}>Número de teléfono (WhatsApp):</ThemedText>
                        <TextInput
                            style={styles.input}
                            value={pacienteTelefono}
                            onChangeText={setPacienteTelefono}
                            keyboardType="phone-pad"
                            placeholder="Ej. 04161234567"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <ThemedText style={styles.label}>Correo electrónico:</ThemedText>
                        <TextInput
                            style={[styles.input, isPatient && styles.readOnlyInput]}
                            value={pacienteEmail}
                            onChangeText={setPacienteEmail}
                            editable={!isPatient}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholder="correo@ejemplo.com"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <ThemedText style={styles.label}>Fecha de la cita:</ThemedText>
                        <TouchableOpacity
                            style={styles.calendarInputButton}
                            onPress={() => setIsCalendarVisible(true)}
                        >
                            <Text style={[fecha ? styles.inputText : styles.placeholderText, { flex: 1, textAlign: 'left' }]}>
                                {fecha || "Seleccionar fecha (AAAA-MM-DD)"}
                            </Text>
                            <Ionicons name="calendar-outline" size={20} color="#e83e8c" />
                        </TouchableOpacity>
                        <CalendarModal
                            visible={isCalendarVisible}
                            onClose={() => setIsCalendarVisible(false)}
                            onSelectDate={(date) => setFecha(date)}
                            initialDate={fecha || new Date().toISOString().split('T')[0]}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <ThemedText style={styles.label}>Hora de la cita:</ThemedText>
                        <TouchableOpacity
                            style={styles.calendarInputButton}
                            onPress={() => setIsHourDropdownVisible(true)}
                        >
                            <Text style={[hora ? styles.inputText : styles.placeholderText, { flex: 1, textAlign: 'left' }]}>
                                {hora ? (hora === '12:00' ? '12:00 PM' : `${parseInt(hora.split(':')[0])}:00 AM`) : "Seleccionar hora"}
                            </Text>
                            <Ionicons name="time-outline" size={20} color="#e83e8c" />
                        </TouchableOpacity>
                        <DropdownSelector
                            visible={isHourDropdownVisible}
                            onClose={() => setIsHourDropdownVisible(false)}
                            selectedValue={hora}
                            onSelect={(val) => setHora(val)}
                            title="Selecciona la hora de la cita"
                            options={[
                                { label: '09:00 AM', value: '09:00' },
                                { label: '10:00 AM', value: '10:00' },
                                { label: '11:00 AM', value: '11:00' },
                                { label: '12:00 PM', value: '12:00' }
                            ]}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <ThemedText style={styles.label}>Tipo de procedimiento:</ThemedText>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej: Limpieza dental, Ortodoncia..."
                            placeholderTextColor="#888"
                            value={procedimiento}
                            onChangeText={setProcedimiento}
                        />
                    </View>

                    <TouchableOpacity style={styles.button} onPress={handleAgendar}>
                        <ThemedText style={styles.buttonText}>Agendar Cita</ThemedText>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF0F6',
    },
    scrollContent: {
        padding: 24,
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 0,
    },
    menuButton: {
        marginRight: 15,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#e83e8c',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
    },
    formContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 3,
        gap: 16,
    },
    inputContainer: {
        gap: 8,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
    },
    input: {
        height: 50,
        backgroundColor: '#F9F9F9',
        borderRadius: 8,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
    },
    readOnlyInput: {
        backgroundColor: '#F0F0F0',
        color: '#888',
    },
    button: {
        backgroundColor: '#e83e8c',
        height: 56,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
        shadowColor: '#e83e8c',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    calendarInputButton: {
        height: 50,
        backgroundColor: '#F9F9F9',
        borderRadius: 8,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    inputText: {
        fontSize: 16,
        color: '#333',
    },
    placeholderText: {
        fontSize: 16,
        color: '#888',
    },
    timeSlotsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 10,
        marginTop: 4,
    },
    timeSlotButton: {
        flex: 1,
        minWidth: '45%',
        height: 50,
        backgroundColor: '#F9F9F9',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    timeSlotButtonSelected: {
        backgroundColor: '#e83e8c',
        borderColor: '#e83e8c',
    },
    timeSlotText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    timeSlotTextSelected: {
        color: '#FFF',
    },
});
