import { SideMenu } from '@/components/SideMenu';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert } from 'react-native';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DashboardScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const userName = "Usuario";
    const [notifications, setNotifications] = useState([
        { id: 1, title: 'Cita confirmada', message: 'Tu cita del 2 de junio a las 10:00 AM ha sido confirmada.', time: 'Hace 5 min', read: false, icon: 'checkmark-circle', color: '#2E8B57' },
        { id: 2, title: 'Recordatorio de cita', message: 'Tienes una cita mañana a las 9:00 AM. ¡No olvides asistir!', time: 'Hace 1 hora', read: false, icon: 'alarm', color: '#F39C12' },
        { id: 3, title: 'Resultado disponible', message: 'Tu historial de tratamiento ha sido actualizado por la doctora.', time: 'Ayer', read: true, icon: 'document-text', color: '#4A90E2' },
    ]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const markRead = (id: number) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const menuItems = [
        { title: 'Mi Perfil', icon: 'person', route: '/profile', color: '#4A90E2', desc: 'Ver datos personales' },
        { title: 'Pacientes', icon: 'people', route: '/lista-pacientes', color: '#F39C12', desc: 'Gestionar lista de pacientes' },
        { title: 'Agendar Cita', icon: 'calendar', route: '/agendar-citas', color: '#e83e8c', desc: 'Solicita una nueva consulta' },
        { title: 'Calendario', icon: 'calendar-outline', route: '/calendario-citas', color: '#2E8B57', desc: 'Visualiza tus citas del mes' },
        { title: 'Historial de Citas', icon: 'receipt', route: '/historial-citas', color: '#9B51E0', desc: 'Revisa tus citas pasadas y futuras' },
        { title: 'Cerrar Sesión', icon: 'log-out', route: '/login', color: '#FF6B6B', desc: 'Salir de la cuenta' },
    ];

    return (
        <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
            <SideMenu visible={isMenuVisible} onClose={() => setIsMenuVisible(false)} />
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => setIsMenuVisible(true)} style={styles.menuButton}>
                    <Ionicons name="menu" size={32} color="#e83e8c" />
                </TouchableOpacity>
                <View style={styles.topBarRight}>
                    <TouchableOpacity style={styles.notifBell} onPress={() => Alert.alert('Notificaciones', `Tienes ${unreadCount} sin leer.`)}>
                        <Ionicons name="notifications" size={28} color="#e83e8c" />
                        {unreadCount > 0 && (
                            <View style={styles.badge}>
                                <ThemedText style={styles.badgeText}>{unreadCount}</ThemedText>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <ThemedText type="title" style={styles.title}>Bienvenido {userName}</ThemedText>
                    <ThemedText style={styles.subtitle}>Consultorio Odontológico Dra. Nazaret Lopez</ThemedText>
                </View>

                {/* Sección de Notificaciones */}
                <View style={styles.notifSection}>
                    <View style={styles.notifHeader}>
                        <View style={styles.notifTitleRow}>
                            <Ionicons name="notifications-circle" size={24} color="#e83e8c" />
                            <ThemedText type="subtitle" style={styles.sectionTitle}>Notificaciones</ThemedText>
                            {unreadCount > 0 && (
                                <View style={styles.badgeInline}>
                                    <ThemedText style={styles.badgeText}>{unreadCount} nuevas</ThemedText>
                                </View>
                            )}
                        </View>
                        {unreadCount > 0 && (
                            <TouchableOpacity onPress={markAllRead}>
                                <ThemedText style={styles.markAllRead}>Marcar todas</ThemedText>
                            </TouchableOpacity>
                        )}
                    </View>

                    {notifications.length === 0 ? (
                        <View style={styles.emptyNotif}>
                            <Ionicons name="checkmark-done-circle-outline" size={40} color="#ccc" />
                            <ThemedText style={styles.emptyNotifText}>Sin notificaciones pendientes</ThemedText>
                        </View>
                    ) : (
                        notifications.map(notif => (
                            <TouchableOpacity
                                key={notif.id}
                                style={[styles.notifCard, !notif.read && styles.notifCardUnread]}
                                onPress={() => markRead(notif.id)}
                            >
                                <View style={[styles.notifIconBox, { backgroundColor: notif.color }]}>
                                    <Ionicons name={notif.icon as any} size={20} color="#FFF" />
                                </View>
                                <View style={styles.notifBody}>
                                    <View style={styles.notifRow}>
                                        <ThemedText style={styles.notifTitle}>{notif.title}</ThemedText>
                                        {!notif.read && <View style={styles.dotUnread} />}
                                    </View>
                                    <ThemedText style={styles.notifMessage}>{notif.message}</ThemedText>
                                    <ThemedText style={styles.notifTime}>{notif.time}</ThemedText>
                                </View>
                            </TouchableOpacity>
                        ))
                    )}
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
                                if (item.route === '/' || item.route === '/login') {
                                    router.replace(item.route as any);
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
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 0,
    },
    menuButton: {
        marginRight: 15,
    },
    topBarRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    notifBell: {
        position: 'relative',
        padding: 4,
    },
    badge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#FF3B30',
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 3,
    },
    badgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    // --- Notificaciones ---
    notifSection: {
        marginBottom: 28,
    },
    notifHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    notifTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    badgeInline: {
        backgroundColor: '#e83e8c',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    markAllRead: {
        color: '#e83e8c',
        fontSize: 13,
        fontWeight: '600',
    },
    emptyNotif: {
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#FFF',
        borderRadius: 14,
        gap: 10,
    },
    emptyNotifText: {
        color: '#aaa',
        fontSize: 15,
    },
    notifCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 14,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 6,
        elevation: 2,
        alignItems: 'flex-start',
        gap: 12,
    },
    notifCardUnread: {
        borderLeftWidth: 4,
        borderLeftColor: '#e83e8c',
        backgroundColor: '#FFF5F9',
    },
    notifIconBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    notifBody: {
        flex: 1,
        gap: 4,
    },
    notifRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    notifTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#222',
    },
    dotUnread: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#e83e8c',
    },
    notifMessage: {
        fontSize: 13,
        color: '#555',
        lineHeight: 18,
    },
    notifTime: {
        fontSize: 11,
        color: '#aaa',
        marginTop: 2,
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
