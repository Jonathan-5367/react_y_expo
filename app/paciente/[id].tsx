import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { API_URL, User } from '@/store/auth';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PatientProfileScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    
    const [patient, setPatient] = useState<User | null>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch patient profile
                const profileRes = await fetch(`${API_URL}/auth/profile/${id}`);
                if (!profileRes.ok) throw new Error('No se pudo obtener el perfil del paciente');
                const profileData = await profileRes.json();
                
                if (profileData.success && profileData.user) {
                    setPatient(profileData.user);
                }

                // Fetch medical history
                const historyRes = await fetch(`${API_URL}/patients/${id}/history`);
                if (!historyRes.ok) throw new Error('No se pudo obtener el historial médico');
                const historyData = await historyRes.json();
                setHistory(historyData);

            } catch (err: any) {
                console.error('Error fetching patient details:', err);
                setError(err.message || 'Error de conexión');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const calculateAge = (birthDateString?: string) => {
        if (!birthDateString) return 'N/A';
        const birthDate = new Date(birthDateString);
        if (isNaN(birthDate.getTime())) return 'N/A';
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age.toString();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmada': return '#4CAF50';
            case 'completada': return '#2196F3';
            case 'cancelada': return '#F44336';
            case 'no_asistio': return '#FF9800';
            default: return '#FFC107'; // pendiente
        }
    };

    if (loading) {
        return (
            <ThemedView style={[styles.container, { paddingTop: insets.top, justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#e83e8c" />
                <ThemedText style={{ marginTop: 12, color: '#e83e8c', fontWeight: 'bold' }}>Cargando expediente...</ThemedText>
            </ThemedView>
        );
    }

    if (error || !patient) {
        return (
            <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
                <View style={styles.topBar}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#e83e8c" />
                    </TouchableOpacity>
                </View>
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle-outline" size={60} color="#D32F2F" />
                    <ThemedText style={styles.errorText}>{error || 'Paciente no encontrado'}</ThemedText>
                    <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
                        <ThemedText style={styles.retryButtonText}>Volver al listado</ThemedText>
                    </TouchableOpacity>
                </View>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
            <Stack.Screen options={{ headerShown: false }} />
            
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#e83e8c" />
                    <ThemedText style={styles.backText}>Atrás</ThemedText>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* PATIENT INFO CARD */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <ThemedText style={styles.avatarText}>{patient.nombre?.charAt(0).toUpperCase()}</ThemedText>
                    </View>
                    <ThemedText style={styles.patientName}>{patient.nombre}</ThemedText>
                    <ThemedText style={styles.patientId}>C.I: {patient.cedula}</ThemedText>

                    <View style={styles.detailsGrid}>
                        <View style={styles.detailItem}>
                            <Ionicons name="call-outline" size={16} color="#666" style={{ marginRight: 6 }} />
                            <ThemedText style={styles.detailText}>{patient.telefono || 'Sin teléfono'}</ThemedText>
                        </View>
                        <View style={styles.detailItem}>
                            <Ionicons name="mail-outline" size={16} color="#666" style={{ marginRight: 6 }} />
                            <ThemedText style={styles.detailText}>{patient.email}</ThemedText>
                        </View>
                        <View style={styles.detailItem}>
                            <Ionicons name="calendar-outline" size={16} color="#666" style={{ marginRight: 6 }} />
                            <ThemedText style={styles.detailText}>{patient.fechaNacimiento ? `${calculateAge(patient.fechaNacimiento)} años` : 'Edad N/A'}</ThemedText>
                        </View>
                        <View style={styles.detailItem}>
                            <Ionicons name="people-outline" size={16} color="#666" style={{ marginRight: 6 }} />
                            <ThemedText style={styles.detailText}>Familiar: {patient.telefonoFamiliar || 'N/A'}</ThemedText>
                        </View>
                    </View>

                    {patient.alergias && (
                        <View style={styles.allergyContainer}>
                            <Ionicons name="warning-outline" size={18} color="#D32F2F" style={{ marginRight: 8 }} />
                            <ThemedText style={styles.allergyText}>Alergias: {patient.alergias}</ThemedText>
                        </View>
                    )}
                </View>

                {/* MEDICAL HISTORY */}
                <View style={styles.historySection}>
                    <ThemedText type="subtitle" style={styles.sectionTitle}>Historial Clínico ({history.length})</ThemedText>
                    
                    {history.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="folder-open-outline" size={40} color="#ccc" />
                            <ThemedText style={styles.emptyText}>Este paciente no tiene citas registradas.</ThemedText>
                        </View>
                    ) : (
                        history.map((cita) => (
                            <View key={cita.id} style={[styles.historyCard, cita.pasada && styles.historyCardPast]}>
                                <View style={styles.historyCardHeader}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Ionicons name="calendar" size={16} color="#e83e8c" style={{ marginRight: 6 }} />
                                        <ThemedText style={styles.historyDate}>{cita.fecha} • {cita.hora}</ThemedText>
                                    </View>
                                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(cita.estado) + '20' }]}>
                                        <ThemedText style={[styles.statusText, { color: getStatusColor(cita.estado) }]}>
                                            {cita.estado.toUpperCase()}
                                        </ThemedText>
                                    </View>
                                </View>
                                <ThemedText style={styles.procedureText}>{cita.procedimiento}</ThemedText>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                                    <Ionicons name="medical" size={14} color="#666" style={{ marginRight: 6 }} />
                                    <ThemedText style={styles.doctorText}>Tratado por: {cita.doctor}</ThemedText>
                                </View>
                            </View>
                        ))
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
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 10,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
    },
    backText: {
        color: '#e83e8c',
        fontWeight: 'bold',
        marginLeft: 4,
        fontSize: 16,
    },
    scrollContent: {
        padding: 20,
    },
    profileCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 3,
        marginBottom: 24,
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FFE5F0',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        borderWidth: 2,
        borderColor: '#e83e8c',
    },
    avatarText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#e83e8c',
    },
    patientName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
        textAlign: 'center',
    },
    patientId: {
        fontSize: 16,
        color: '#888',
        marginBottom: 20,
    },
    detailsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%',
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        paddingTop: 16,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '48%',
    },
    detailText: {
        fontSize: 14,
        color: '#555',
    },
    allergyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFEBEE',
        padding: 12,
        borderRadius: 8,
        width: '100%',
        marginTop: 16,
    },
    allergyText: {
        color: '#D32F2F',
        fontWeight: 'bold',
        fontSize: 14,
    },
    historySection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#e83e8c',
        marginBottom: 16,
    },
    historyCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#e83e8c',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    historyCardPast: {
        opacity: 0.8,
        borderLeftColor: '#ccc',
    },
    historyCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    historyDate: {
        fontWeight: 'bold',
        color: '#333',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    procedureText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    doctorText: {
        fontSize: 14,
        color: '#666',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
    },
    emptyText: {
        marginTop: 12,
        color: '#888',
        fontSize: 16,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    errorText: {
        fontSize: 18,
        color: '#D32F2F',
        marginTop: 16,
        marginBottom: 24,
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: '#e83e8c',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
