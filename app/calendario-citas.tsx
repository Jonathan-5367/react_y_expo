import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SideMenu } from '@/components/SideMenu';
import { NotifBell } from '@/components/NotifBell';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CalendarioCitasScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [isMenuVisible, setIsMenuVisible] = useState(false);

    // Mock data for the calendar
    const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1); // Mock 30 days
    const startDayOffset = 2; // Starts on Tuesday

    const citas = [
        { day: 10, time: '09:00 AM', type: 'Consulta General' },
        { day: 15, time: '10:00 AM', type: 'Limpieza Dental' },
        { day: 22, time: '02:30 PM', type: 'Ortodoncia' },
    ];

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
                    <ThemedText style={styles.subtitle}>Visualiza y planifica tus consultas mensuales</ThemedText>
                </View>

                <View style={styles.calendarContainer}>
                    <View style={styles.monthHeader}>
                        <Ionicons name="chevron-back" size={24} color="#e83e8c" />
                        <ThemedText style={styles.monthText}>Mayo 2026</ThemedText>
                        <Ionicons name="chevron-forward" size={24} color="#e83e8c" />
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
                            const isCita = citas.find(c => c.day === day);
                            return (
                                <View key={day} style={[styles.dayCell, isCita && styles.dayCellActive]}>
                                    <ThemedText style={[styles.dayText, isCita && styles.dayTextActive]}>{day}</ThemedText>
                                    {isCita && <View style={styles.dot} />}
                                </View>
                            );
                        })}
                    </View>
                </View>

                <View style={styles.citasList}>
                    <ThemedText style={styles.listTitle}>Próximas Citas</ThemedText>
                    {citas.map((cita, idx) => (
                        <View key={idx} style={styles.citaCard}>
                            <View style={styles.citaDateBox}>
                                <ThemedText style={styles.citaDateDay}>{cita.day}</ThemedText>
                                <ThemedText style={styles.citaDateMonth}>MAY</ThemedText>
                            </View>
                            <View style={styles.citaInfo}>
                                <ThemedText style={styles.citaType}>{cita.type}</ThemedText>
                                <View style={styles.citaTimeRow}>
                                    <Ionicons name="time-outline" size={16} color="#888" style={{ marginRight: 4 }} />
                                    <ThemedText style={styles.citaTime}>{cita.time}</ThemedText>
                                </View>
                            </View>
                        </View>
                    ))}
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
    },
    citaType: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    citaTimeRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    citaTime: {
        fontSize: 16,
        color: '#888',
    },
});
