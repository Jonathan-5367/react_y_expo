import { SideMenu } from '@/components/SideMenu';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DashboardScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const userName = "Usuario";

    const menuItems = [
        { title: 'Mi Perfil', icon: 'person', route: '/profile', color: '#4A90E2', desc: 'Ver datos personales' },
        { title: 'Agendar Cita', icon: 'calendar', route: '/agendar-citas', color: '#e83e8c', desc: 'Solicita una nueva consulta' },
        { title: 'Historial de Citas', icon: 'receipt', route: '/historial-citas', color: '#9B51E0', desc: 'Revisa tus citas pasadas y futuras' },
        { title: 'Cerrar Sesión', icon: 'log-out', route: '/', color: '#FF6B6B', desc: 'Salir de la cuenta' },
    ];

    return (
        <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
            <SideMenu visible={isMenuVisible} onClose={() => setIsMenuVisible(false)} />
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => setIsMenuVisible(true)} style={styles.menuButton}>
                    <Ionicons name="menu" size={32} color="#e83e8c" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <ThemedText type="title" style={styles.title}>Bienvenido {userName}</ThemedText>
                    <ThemedText style={styles.subtitle}>Consultorio Odontológico Dra. Nazaret Lopez</ThemedText>
                </View>

                <View style={styles.calendarSection}>
                    <ThemedText type="subtitle" style={styles.sectionTitle}>Mi Calendario de Citas</ThemedText>
                    <View style={styles.calendarPlaceholder}>
                        <Ionicons name="calendar-outline" size={48} color="#e83e8c" />
                        <ThemedText style={styles.calendarText}>Aquí se mostrará tu calendario de citas programadas.</ThemedText>
                        <TouchableOpacity style={styles.button} onPress={() => router.push('/agendar-citas')}>
                            <ThemedText style={styles.buttonText}>Agendar Nueva Cita</ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.menuContainer}>
                    <ThemedText type="subtitle" style={styles.sectionTitle}>Menú de Opciones</ThemedText>
                    <View style={styles.grid}>
                        {menuItems.map((item) => (
                            <TouchableOpacity key={item.route} style={styles.card} onPress={() => {
                                if (item.route === '/') {
                                    router.replace(item.route);
                                } else {
                                    router.push(item.route as any);
                                }
                            }}>
                                <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                                    <Ionicons name={item.icon as any} size={32} color="#FFF" />
                                </View>
                                <View style={styles.cardContent}>
                                    <ThemedText type="subtitle" style={styles.cardTitle}>{item.title}</ThemedText>
                                    <ThemedText style={styles.cardDesc}>{item.desc}</ThemedText>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
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
        paddingTop: 10,
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
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
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
        textAlign: 'center',
    },
    calendarSection: {
        marginBottom: 32,
    },
    calendarPlaceholder: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 3,
    },
    calendarText: {
        marginTop: 16,
        marginBottom: 20,
        textAlign: 'center',
        color: '#666',
    },
    button: {
        backgroundColor: '#e83e8c',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    menuContainer: {
        marginBottom: 20,
    },
    grid: {
        gap: 16,
    },
    card: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        padding: 24,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    cardContent: {
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 18,
        color: '#333',
        marginBottom: 4,
        textAlign: 'center',
    },
    cardDesc: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
    },
});
