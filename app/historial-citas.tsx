import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HistorialCitasScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const citas = [
        { id: 1, fecha: '15/06/2026', hora: '10:00', procedimiento: 'Limpieza Dental', doctor: 'Dra. Nazaret Lopez', estado: 'confirmada', pasada: false },
        { id: 2, fecha: '02/05/2026', hora: '14:30', procedimiento: 'Ortodoncia', doctor: 'Dra. Nazaret Lopez', estado: 'completada', pasada: true },
        { id: 3, fecha: '10/04/2026', hora: '09:00', procedimiento: 'Consulta General', doctor: 'Dra. Nazaret Lopez', estado: 'cancelada', pasada: true },
    ];

    const getStatusColor = (estado: string) => {
        switch (estado) {
            case 'confirmada': return '#4CAF50';
            case 'completada': return '#2196F3';
            case 'cancelada': return '#F44336';
            case 'pendiente': return '#FFC107';
            default: return '#888';
        }
    };

    return (
        <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
            <Stack.Screen options={{ title: 'Historial de Citas', headerTransparent: true }} />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#e83e8c" />
                    <ThemedText style={styles.backText}>Volver</ThemedText>
                </TouchableOpacity>

                <View style={styles.header}>
                    <ThemedText type="title" style={styles.title}>Mis Citas Agendadas</ThemedText>
                    <ThemedText style={styles.subtitle}>Revisa el historial de tus tratamientos.</ThemedText>
                </View>

                <View style={styles.listContainer}>
                    {citas.map((cita) => (
                        <View key={cita.id} style={[styles.card, cita.pasada && styles.cardPasada]}>
                            <View style={styles.cardHeader}>
                                <View style={styles.dateInfo}>
                                    <Ionicons name="calendar" size={18} color="#e83e8c" style={{ marginRight: 6 }} />
                                    <ThemedText style={styles.dateText}>{cita.fecha} - {cita.hora}</ThemedText>
                                </View>
                                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(cita.estado) + '20' }]}>
                                    <ThemedText style={[styles.statusText, { color: getStatusColor(cita.estado) }]}>
                                        {cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}
                                    </ThemedText>
                                </View>
                            </View>
                            
                            <View style={styles.cardBody}>
                                <ThemedText type="subtitle" style={styles.procedimientoText}>{cita.procedimiento}</ThemedText>
                                <View style={styles.doctorInfo}>
                                    <Ionicons name="medical" size={16} color="#888" style={{ marginRight: 6 }} />
                                    <ThemedText style={styles.doctorText}>{cita.doctor}</ThemedText>
                                </View>
                            </View>

                            {!cita.pasada && cita.estado !== 'cancelada' && (
                                <View style={styles.cardFooter}>
                                    <TouchableOpacity style={styles.cancelButton}>
                                        <Ionicons name="close-circle-outline" size={18} color="#F44336" style={{ marginRight: 4 }} />
                                        <ThemedText style={styles.cancelText}>Cancelar Cita</ThemedText>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    ))}
                    
                    {citas.length === 0 && (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="calendar-clear-outline" size={64} color="#ccc" />
                            <ThemedText style={styles.emptyText}>No tienes citas agendadas.</ThemedText>
                            <TouchableOpacity style={styles.emptyButton} onPress={() => router.push('/agendar-citas')}>
                                <ThemedText style={styles.emptyButtonText}>Agendar mi primera cita</ThemedText>
                            </TouchableOpacity>
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
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    backText: {
        marginLeft: 8,
        color: '#e83e8c',
        fontSize: 16,
        fontWeight: 'bold',
    },
    header: {
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
    },
    doctorText: {
        color: '#666',
        fontSize: 14,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        paddingTop: 12,
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
