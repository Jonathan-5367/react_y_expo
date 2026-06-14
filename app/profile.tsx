import { NotifBell } from '@/components/NotifBell';
import { SideMenu } from '@/components/SideMenu';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { API_URL, useAuth, User } from '@/store/auth';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const { user } = useAuth();
    const [profileData, setProfileData] = useState<User | null>(user);
    const [loading, setLoading] = useState(false);

    // Redirect to login if user is not logged in
    useEffect(() => {
        if (!user) {
            router.replace('/login');
        }
    }, [user]);

    // Fetch latest user details from DB on mount
    useEffect(() => {
        if (user?.id) {
            setLoading(true);
            fetch(`${API_URL}/auth/profile/${user.id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.user) {
                        setProfileData(data.user);
                    }
                })
                .catch(err => {
                    console.error('Error fetching user profile:', err);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [user?.id]);

    // Calculate age from date of birth helper
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

    // Format date YYYY-MM-DD to DD/MM/YYYY
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        const parts = dateString.split('T')[0].split('-');
        if (parts.length === 3) {
            const [year, month, day] = parts;
            return `${day}/${month}/${year}`;
        }
        return dateString;
    };

    const displayAge = profileData?.fechaNacimiento ? `${calculateAge(profileData.fechaNacimiento)} años` : 'N/A';
    const displayRol = profileData?.rol ? (profileData.rol.charAt(0).toUpperCase() + profileData.rol.slice(1)) : 'Paciente';

    if (!user) {
        return null; // Don't render while redirecting
    }

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

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#e83e8c" />
                    <ThemedText style={{ marginTop: 12, color: '#e83e8c', fontWeight: 'bold' }}>Cargando perfil...</ThemedText>
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContent}>

                    <View style={styles.header}>
                        <View style={styles.avatarContainer}>
                            <Ionicons name="person-circle" size={100} color="#e83e8c" />
                        </View>
                        <ThemedText type="title" style={styles.title}>Mi Perfil</ThemedText>
                        <ThemedText style={styles.subtitle}>Gestiona tu información personal</ThemedText>
                    </View>

                    <View style={styles.profileContainer}>
                        <ProfileItem icon="person" label="Nombre Completo" value={profileData?.nombre || 'N/A'} />
                        <ProfileItem icon="card" label="Cédula" value={profileData?.cedula || 'N/A'} />
                        <ProfileItem icon="mail" label="Correo Electrónico" value={profileData?.email || 'N/A'} />
                        <ProfileItem icon="call" label="Teléfono" value={profileData?.telefono || 'N/A'} />
                        <ProfileItem icon="calendar" label="Fecha de Nacimiento" value={formatDate(profileData?.fechaNacimiento)} />
                        <ProfileItem icon="accessibility" label="Edad" value={displayAge} />
                        <ProfileItem icon="shield-checkmark" label="Rol" value={displayRol} />
                        <ProfileItem icon="people" label="Número de Familiar" value={profileData?.telefonoFamiliar || 'N/A'} />
                        <ProfileItem icon="alert-circle" label="Alergias Conocidas" value={profileData?.alergias || 'Ninguna conocida'} />
                    </View>

                </ScrollView>
            )}
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
        justifyContent: 'space-between',
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF0F6',
    },
});
