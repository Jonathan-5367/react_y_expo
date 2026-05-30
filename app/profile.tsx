import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SideMenu } from '@/components/SideMenu';

export default function ProfileScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [isMenuVisible, setIsMenuVisible] = useState(false);

    // Mock data based on perfil.php structure
    const usuario = {
        nombre: "Juan Pérez",
        cedula: "12345678",
        email: "juan.perez@ejemplo.com",
        telefono: "04141234567",
        fecha_nacimiento: "1990-05-15",
        edad: "35",
        rol_nombre: "Paciente"
    };

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
                    <View style={styles.avatarContainer}>
                        <Ionicons name="person-circle" size={100} color="#e83e8c" />
                    </View>
                    <ThemedText type="title" style={styles.title}>Mi Perfil de Usuario</ThemedText>
                    <ThemedText style={styles.subtitle}>Gestiona tu información personal</ThemedText>
                </View>

                <View style={styles.profileContainer}>
                    <ProfileItem icon="person" label="Nombre Completo" value={usuario.nombre} />
                    <ProfileItem icon="card" label="Cédula" value={usuario.cedula} />
                    <ProfileItem icon="mail" label="Correo Electrónico" value={usuario.email} />
                    <ProfileItem icon="call" label="Teléfono" value={usuario.telefono} />
                    <ProfileItem icon="calendar" label="Fecha de Nacimiento" value={usuario.fecha_nacimiento} />
                    <ProfileItem icon="accessibility" label="Edad" value={`${usuario.edad} años`} />
                    <ProfileItem icon="shield-checkmark" label="Rol" value={usuario.rol_nombre} />
                </View>

            </ScrollView>
        </ThemedView>
    );
}

function ProfileItem({ icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <View style={styles.profileItem}>
            <View style={styles.iconContainer}>
                <Ionicons name={icon} size={24} color="#e83e8c" />
            </View>
            <View style={styles.infoContainer}>
                <ThemedText style={styles.label}>{label}</ThemedText>
                <ThemedText style={styles.value}>{value}</ThemedText>
            </View>
        </View>
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
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 10,
    },
    menuButton: {
        marginRight: 15,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatarContainer: {
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        backgroundColor: '#FFF',
        borderRadius: 50,
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
    profileContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 3,
        gap: 16,
    },
    profileItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFF0F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    infoContainer: {
        flex: 1,
    },
    label: {
        fontSize: 12,
        color: '#888',
        marginBottom: 4,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    value: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
});
