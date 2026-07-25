import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useRouter, useFocusEffect } from 'expo-router';
import React, { useState, useCallback } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SideMenu } from '@/components/SideMenu';
import { NotifBell } from '@/components/NotifBell';
import { useAuth } from '@/store/auth';
import { useAppointments } from '@/store/appointments';

export default function HistorialCitasScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const { user } = useAuth();
    const { appointments, cancelAppointment, confirmAppointment, fetchAppointments } = useAppointments();

    useFocusEffect(
        useCallback(() => {
            fetchAppointments();
        }, [fetchAppointments])
    );

    const isAdmin = user?.rol === 'administrador' || user?.rol === 'doctor' || user?.rol === 'recepcionista';
    
    // Filter appointments: admins see all, patients see only their own
    const citas = appointments.filter(cita => {
        if (isAdmin) return true;
        return cita.pacienteEmail.toLowerCase() === user?.email?.toLowerCase();
    });

    const getStatusColor = (estado: string) => {
        switch (estado) {
            case 'confirmada': return '#4CAF50';
            case 'completada': return '#2196F3';
            case 'cancelada': return '#F44336';
            case 'pendiente': return '#FFC107';
            default: return '#888';
        }
    };

    const formatFecha = (fechaStr: string) => {
        if (!fechaStr) return '';
        const parts = fechaStr.split('-');
        if (parts.length === 3) {
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        return fechaStr;
    };

    const handleCancelar = (id: number) => {
        Alert.alert(
            'Confirmar Cancelación',
            '¿Estás seguro de que deseas cancelar esta cita?',
            [
                { text: 'No', style: 'cancel' },
                {
                    text: 'Sí, Cancelar',
                    style: 'destructive',
                    onPress: async () => {
                        const success = await cancelAppointment(id);
                        if (success) {
                            Alert.alert('Cita Cancelada', 'La cita ha sido cancelada con éxito.');
                        } else {
                            Alert.alert('Error', 'No se pudo cancelar la cita.');
                        }
                    }
                }
            ]
        );
    };

    const handleConfirmar = (id: number) => {
        Alert.alert(
            'Confirmar Cita',
            '¿Estás seguro de que deseas confirmar esta cita?',
            [
                { text: 'No', style: 'cancel' },
                {
                    text: 'Sí, Confirmar',
                    onPress: async () => {
                        const success = await confirmAppointment(id);
                        if (success) {
                            Alert.alert('Cita Confirmada', 'La cita ha sido confirmada con éxito.');
                        } else {
                            Alert.alert('Error', 'No se pudo confirmar la cita.');
                        }
                    }
                }
            ]
        );
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
                    <ThemedText type="title" style={styles.title}>
                        {isAdmin ? "Todas las Citas" : "Mis Citas Agendadas"}
                    </ThemedText>
                    <ThemedText style={styles.subtitle}>
                        {isAdmin ? "Gestión global de citas del consultorio." : "Revisa el historial de tus tratamientos."}
                    </ThemedText>
                </View>

                <View style={styles.listContainer}>
                    {citas.map((cita) => (
                        <View key={cita.id} style={[styles.card, cita.pasada && styles.cardPasada]}>
                            <View style={styles.cardHeader}>
                                <View style={styles.dateInfo}>
                                    <Ionicons name="calendar" size={18} color="#e83e8c" style={{ marginRight: 6 }} />
                                    <ThemedText style={styles.dateText}>{formatFecha(cita.fecha)} - {cita.hora}</ThemedText>
                                </View>
                                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(cita.estado) + '20' }]}>
                                    <ThemedText style={[styles.statusText, { color: getStatusColor(cita.estado) }]}>
                                        {cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}
                                    </ThemedText>
                                </View>
                            </View>
                            
                            <View style={styles.cardBody}>
                                <ThemedText type="subtitle" style={styles.procedimientoText}>{cita.procedimiento}</ThemedText>
                                
                                {isAdmin && (
                                    <View style={styles.patientInfoRow}>
                                        <Ionicons name="person" size={15} color="#e83e8c" style={{ marginRight: 6 }} />
                                        <ThemedText style={styles.patientInfoText}>
                                            Paciente: <ThemedText style={{ fontWeight: 'bold' }}>{cita.pacienteNombre}</ThemedText> ({cita.pacienteTelefono})
                                        </ThemedText>
                                    </View>
                                )}

                                <View style={styles.doctorInfo}>
                                    <Ionicons name="medical" size={16} color="#888" style={{ marginRight: 6 }} />
                                    <ThemedText style={styles.doctorText}>{cita.doctor}</ThemedText>
                                </View>
                            </View>

                            {!cita.pasada && (
                                <View style={styles.cardFooter}>
                                    {isAdmin && cita.estado === 'pendiente' && (
                                        <TouchableOpacity style={styles.confirmButton} onPress={() => handleConfirmar(cita.id)}>
                                            <Ionicons name="checkmark-circle-outline" size={18} color="#4CAF50" style={{ marginRight: 4 }} />
                                            <ThemedText style={styles.confirmText}>Confirmar Cita</ThemedText>
                                        </TouchableOpacity>
                                    )}
                                    {cita.estado !== 'cancelada' && cita.estado !== 'completada' && (
                                        <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancelar(cita.id)}>
                                            <Ionicons name="close-circle-outline" size={18} color="#F44336" style={{ marginRight: 4 }} />
                                            <ThemedText style={styles.cancelText}>Cancelar Cita</ThemedText>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            )}
                        </View>
                    ))}
                    
                    {citas.length === 0 && (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="calendar-clear-outline" size={64} color="#ccc" />
                            <ThemedText style={styles.emptyText}>
                                {isAdmin ? "No hay citas registradas en el consultorio." : "No tienes citas agendadas."}
                            </ThemedText>
                            {!isAdmin && (
                                <TouchableOpacity style={styles.emptyButton} onPress={() => router.push('/agendar-citas')}>
                                    <ThemedText style={styles.emptyButtonText}>Agendar mi primera cita</ThemedText>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
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
        fontSize: 28,
        fontWeight: 'bold',
        color: '#e83e8c',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
    },
    listContainer: {
        gap: 16,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
        borderLeftWidth: 4,
        borderLeftColor: '#e83e8c',
    },
    cardPasada: {
        opacity: 0.7,
        borderLeftColor: '#ccc',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        paddingBottom: 12,
    },
    dateInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateText: {
        fontWeight: 'bold',
        color: '#333',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    cardBody: {
        marginBottom: 12,
    },
    procedimientoText: {
        fontSize: 18,
        color: '#333',
        marginBottom: 6,
    },
    doctorInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    doctorText: {
        color: '#666',
        fontSize: 14,
    },
    patientInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
        backgroundColor: '#FFF0F6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    patientInfoText: {
        fontSize: 13,
        color: '#555',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        paddingTop: 12,
    },
    confirmButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 6,
        marginRight: 12,
    },
    confirmText: {
        color: '#4CAF50',
        fontWeight: 'bold',
        fontSize: 14,
    },
    cancelButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 6,
    },
    cancelText: {
        color: '#F44336',
        fontWeight: 'bold',
        fontSize: 14,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        backgroundColor: '#FFF',
        borderRadius: 16,
    },
    emptyText: {
        marginTop: 16,
        marginBottom: 24,
        color: '#888',
        fontSize: 16,
        textAlign: 'center',
        paddingHorizontal: 16,
    },
    emptyButton: {
        backgroundColor: '#e83e8c',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
    },
    emptyButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
