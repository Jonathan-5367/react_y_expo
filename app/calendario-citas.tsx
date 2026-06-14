import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SideMenu } from '@/components/SideMenu';
import { NotifBell } from '@/components/NotifBell';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/store/auth';
import { useAppointments } from '@/store/appointments';

export default function CalendarioCitasScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const { user } = useAuth();
    const { appointments } = useAppointments();

    const isAdmin = user?.rol === 'administrador';

    // State to manage the viewed month and year
    const [viewDate, setViewDate] = useState(new Date(2026, 5, 1)); // Default: June 2026 (index 5)

    const handlePrevMonth = () => {
        setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    
    // Calculate calendar variables for current viewDate
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    
    const totalDays = new Date(year, month + 1, 0).getDate();
    const daysInMonth = Array.from({ length: totalDays }, (_, i) => i + 1);
    const startDayOffset = new Date(year, month, 1).getDay();

    const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const monthText = `${meses[month]} ${year}`;

    // Filter appointments for the current viewed month/year and active status
    const viewYearStr = String(year);
    const viewMonthStr = String(month + 1).padStart(2, '0');

    const relevantAppointments = appointments.filter(a => {
        if (a.estado === 'cancelada') return false;
        
        // Patients see only their own, admins see all
        if (!isAdmin && a.pacienteEmail.toLowerCase() !== user?.email?.toLowerCase()) {
            return false;
        }

        const [aYear, aMonth] = a.fecha.split('-');
        return aYear === viewYearStr && aMonth === viewMonthStr;
    });

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
                    <ThemedText type="title" style={styles.title}>Calendario de Citas</ThemedText>
                    <ThemedText style={styles.subtitle}>
                        {isAdmin ? "Vista global de citas programadas en la clínica" : "Visualiza y planifica tus consultas mensuales"}
                    </ThemedText>
                </View>

                <View style={styles.calendarContainer}>
                    <View style={styles.monthHeader}>
                        <TouchableOpacity onPress={handlePrevMonth}>
                            <Ionicons name="chevron-back" size={24} color="#e83e8c" />
                        </TouchableOpacity>
                        <ThemedText style={styles.monthText}>{monthText}</ThemedText>
                        <TouchableOpacity onPress={handleNextMonth}>
                            <Ionicons name="chevron-forward" size={24} color="#e83e8c" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.daysRow}>
                        {daysOfWeek.map(day => (
                            <ThemedText key={day} style={styles.dayOfWeek}>{day}</ThemedText>
                        ))}
                    </View>

                    <View style={styles.grid}>
                        {Array.from({ length: startDayOffset }).map((_, i) => (
                            <View key={`empty-${i}`} style={styles.dayCell} />
                        ))}
                        {daysInMonth.map(day => {
                            const dayStr = String(day).padStart(2, '0');
                            const targetDateStr = `${viewYearStr}-${viewMonthStr}-${dayStr}`;
                            const dayCitas = relevantAppointments.filter(c => c.fecha === targetDateStr);
                            const hasCita = dayCitas.length > 0;
                            
                            return (
                                <View key={day} style={[styles.dayCell, hasCita && styles.dayCellActive]}>
                                    <ThemedText style={[styles.dayText, hasCita && styles.dayTextActive]}>{day}</ThemedText>
                                    {hasCita && <View style={styles.dot} />}
                                </View>
                            );
                        })}
                    </View>
                </View>

                <View style={styles.citasList}>
                    <ThemedText style={styles.listTitle}>Citas del Mes</ThemedText>
                    {relevantAppointments.map((cita) => {
                        const dayNum = parseInt(cita.fecha.split('-')[2]);
                        const monthAbbr = meses[month].substring(0, 3).toUpperCase();
                        return (
                            <View key={cita.id} style={styles.citaCard}>
                                <View style={styles.citaDateBox}>
                                    <ThemedText style={styles.citaDateDay}>{dayNum}</ThemedText>
                                    <ThemedText style={styles.citaDateMonth}>{monthAbbr}</ThemedText>
                                </View>
                                <View style={styles.citaInfo}>
                                    <ThemedText style={styles.citaType}>{cita.procedimiento}</ThemedText>
                                    {isAdmin && (
                                        <ThemedText style={styles.patientLabel}>
                                            Paciente: <ThemedText style={{ fontWeight: 'bold' }}>{cita.pacienteNombre}</ThemedText>
                                        </ThemedText>
                                    )}
                                    <View style={styles.citaTimeRow}>
                                        <Ionicons name="time-outline" size={16} color="#888" style={{ marginRight: 4 }} />
                                        <ThemedText style={styles.citaTime}>{cita.hora}</ThemedText>
                                    </View>
                                </View>
                            </View>
                        );
                    })}
                    {relevantAppointments.length === 0 && (
                        <View style={styles.emptyAppointments}>
                            <Ionicons name="calendar-clear-outline" size={32} color="#aaa" />
                            <ThemedText style={styles.emptyAppointmentsText}>No hay citas programadas para este mes.</ThemedText>
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
    calendarContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 3,
        marginBottom: 24,
    },
    monthHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    monthText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    daysRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 8,
    },
    dayOfWeek: {
        width: `${100/7}%`,
        textAlign: 'center',
        color: '#888',
        fontWeight: '600',
        fontSize: 16,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dayCell: {
        width: `${100/7}%`,
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4,
    },
    dayCellActive: {
        backgroundColor: '#FFE5F0',
        borderRadius: 8,
    },
    dayText: {
        fontSize: 18,
        color: '#333',
    },
    dayTextActive: {
        fontWeight: 'bold',
        color: '#e83e8c',
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#e83e8c',
        marginTop: 2,
    },
    citasList: {
        marginTop: 8,
    },
    listTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
        textAlign: 'center',
    },
    citaCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        alignItems: 'center',
    },
    citaDateBox: {
        backgroundColor: '#FFF0F6',
        borderRadius: 8,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
        width: 60,
    },
    citaDateDay: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#e83e8c',
    },
    citaDateMonth: {
        fontSize: 14,
        color: '#e83e8c',
        fontWeight: '600',
    },
    citaInfo: {
        flex: 1,
        gap: 2,
    },
    citaType: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 2,
    },
    patientLabel: {
        fontSize: 13,
        color: '#555',
        marginBottom: 2,
    },
    citaTimeRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    citaTime: {
        fontSize: 16,
        color: '#888',
    },
    emptyAppointments: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#FFF',
        borderRadius: 12,
        gap: 8,
    },
    emptyAppointmentsText: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
    },
});
