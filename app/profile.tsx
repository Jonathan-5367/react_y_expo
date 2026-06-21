import { NotifBell } from '@/components/NotifBell';
import { SideMenu } from '@/components/SideMenu';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { API_URL, useAuth, User, useProtectedRoute } from '@/store/auth';
import { CalendarModal } from '@/components/CalendarModal';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const { user, updateProfile } = useAuth();
    const [profileData, setProfileData] = useState<User | null>(user);
    const [loading, setLoading] = useState(false);

    useProtectedRoute();

    // Editing states
    const [isEditing, setIsEditing] = useState(false);
    const [nombre, setNombre] = useState('');
    const [cedula, setCedula] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [telefonoFamiliar, setTelefonoFamiliar] = useState('');
    const [alergias, setAlergias] = useState('');
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);

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

    // Update form fields when profileData is loaded
    useEffect(() => {
        if (profileData) {
            setNombre(profileData.nombre || '');
            setCedula(profileData.cedula || '');
            setEmail(profileData.email || '');
            setTelefono(profileData.telefono || '');
            setFechaNacimiento(profileData.fechaNacimiento ? profileData.fechaNacimiento.split('T')[0] : '');
            setTelefonoFamiliar(profileData.telefonoFamiliar || '');
            setAlergias(profileData.alergias || '');
        }
    }, [profileData]);

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

    const handleStartEditing = () => {
        Alert.alert(
            'Editar Perfil',
            '¿Deseas editar tu perfil?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Sí', onPress: () => setIsEditing(true) }
            ]
        );
    };

    const handleCancelEditing = () => {
        if (profileData) {
            setNombre(profileData.nombre || '');
            setCedula(profileData.cedula || '');
            setEmail(profileData.email || '');
            setTelefono(profileData.telefono || '');
            setFechaNacimiento(profileData.fechaNacimiento ? profileData.fechaNacimiento.split('T')[0] : '');
            setTelefonoFamiliar(profileData.telefonoFamiliar || '');
            setAlergias(profileData.alergias || '');
        }
        setIsEditing(false);
    };

    const handleSave = () => {
        if (!nombre.trim() || !cedula.trim() || !email.trim()) {
            Alert.alert('Campos requeridos', 'Nombre, Cédula y Correo son campos obligatorios.');
            return;
        }

        Alert.alert(
            'Guardar Cambios',
            '¿Deseas guardar los cambios?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Sí', onPress: executeSave }
            ]
        );
    };

    const executeSave = async () => {
        if (!user?.id) return;
        setLoading(true);
        try {
            const result = await updateProfile(user.id, {
                nombre: nombre.trim(),
                cedula: cedula.trim(),
                email: email.trim().toLowerCase(),
                telefono: telefono.trim(),
                fechaNacimiento: fechaNacimiento.trim() || undefined,
                telefonoFamiliar: telefonoFamiliar.trim() || undefined,
                alergias: alergias.trim() || undefined
            });

            if (result.success) {
                Alert.alert('Perfil Actualizado', 'Tu perfil ha sido actualizado con éxito.');
                setProfileData(result.user || null);
                setIsEditing(false);
            } else {
                Alert.alert('Error al Actualizar', result.error || 'Ocurrió un error inesperado.');
            }
        } finally {
            setLoading(false);
        }
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
            <CalendarModal
                visible={isCalendarVisible}
                onClose={() => setIsCalendarVisible(false)}
                onSelectDate={(date) => setFechaNacimiento(date)}
                initialDate={fechaNacimiento || "1995-01-01"}
            />

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
                <ScrollView 
                    contentContainerStyle={styles.scrollContent}
                    automaticallyAdjustKeyboardInsets={true}
                    keyboardShouldPersistTaps="handled"
                >

                    <View style={styles.header}>
                        <View style={styles.avatarContainer}>
                            <Ionicons name="person-circle" size={100} color="#e83e8c" />
                        </View>
                        <ThemedText type="title" style={styles.title}>Mi Perfil</ThemedText>
                        <ThemedText style={styles.subtitle}>Gestiona tu información personal</ThemedText>
                    </View>

                    <View style={styles.actionButtonsContainer}>
                        {!isEditing ? (
                            <TouchableOpacity style={styles.editButton} onPress={handleStartEditing}>
                                <Ionicons name="create-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
                                <ThemedText style={styles.actionButtonText}>Editar Perfil</ThemedText>
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.editingButtonsRow}>
                                <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEditing}>
                                    <Ionicons name="close-circle-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
                                    <ThemedText style={styles.actionButtonText}>Cancelar</ThemedText>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                                    <Ionicons name="save-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
                                    <ThemedText style={styles.actionButtonText}>Guardar</ThemedText>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    <View style={styles.profileContainer}>
                        <ProfileItem 
                            icon="person" 
                            label="Nombre Completo" 
                            value={isEditing ? nombre : (profileData?.nombre || 'N/A')} 
                            isEditing={isEditing} 
                            onChangeText={setNombre} 
                            placeholder="Ej. Juan Pérez"
                        />
                        <ProfileItem 
                            icon="card" 
                            label="Cédula" 
                            value={isEditing ? cedula : (profileData?.cedula || 'N/A')} 
                            isEditing={isEditing} 
                            onChangeText={setCedula} 
                            placeholder="Ej. 12345678"
                            keyboardType="numeric"
                        />
                        <ProfileItem 
                            icon="mail" 
                            label="Correo Electrónico" 
                            value={isEditing ? email : (profileData?.email || 'N/A')} 
                            isEditing={isEditing} 
                            onChangeText={setEmail} 
                            placeholder="Ej. correo@ejemplo.com"
                            keyboardType="email-address"
                        />
                        <ProfileItem 
                            icon="call" 
                            label="Teléfono" 
                            value={isEditing ? telefono : (profileData?.telefono || 'N/A')} 
                            isEditing={isEditing} 
                            onChangeText={(text) => setTelefono(text.replace(/[^0-9]/g, ''))} 
                            placeholder="Ej. 04141234567"
                            keyboardType="phone-pad"
                            maxLength={11}
                        />
                        <ProfileItem 
                            icon="calendar" 
                            label="Fecha de Nacimiento" 
                            value={isEditing ? formatDate(fechaNacimiento) : formatDate(profileData?.fechaNacimiento)} 
                            isEditing={isEditing} 
                            placeholder="Seleccionar fecha"
                            isButton={true}
                            onPress={() => setIsCalendarVisible(true)}
                        />
                        <ProfileItem 
                            icon="accessibility" 
                            label="Edad" 
                            value={displayAge} 
                            isEditing={false} // Read-only
                        />
                        <ProfileItem 
                            icon="shield-checkmark" 
                            label="Rol" 
                            value={displayRol} 
                            isEditing={isEditing} 
                            editable={false} // Never editable
                        />
                        <ProfileItem 
                            icon="people" 
                            label="Número de Familiar" 
                            value={isEditing ? telefonoFamiliar : (profileData?.telefonoFamiliar || 'N/A')} 
                            isEditing={isEditing} 
                            onChangeText={(text) => setTelefonoFamiliar(text.replace(/[^0-9]/g, ''))} 
                            placeholder="Ej. 04149876543"
                            keyboardType="phone-pad"
                            maxLength={11}
                        />
                        <ProfileItem 
                            icon="alert-circle" 
                            label="Alergias Conocidas" 
                            value={isEditing ? alergias : (profileData?.alergias || 'Ninguna conocida')} 
                            isEditing={isEditing} 
                            onChangeText={setAlergias} 
                            placeholder="Ej. Ninguna o Alérgico a penicilina"
                        />
                    </View>

                </ScrollView>
            )}
        </ThemedView>
    );
}

function ProfileItem({ icon, label, value, isEditing = false, onChangeText, keyboardType, placeholder, editable = true, onPress, isButton = false, maxLength }: { 
    icon: any, 
    label: string, 
    value: string, 
    isEditing?: boolean, 
    onChangeText?: (text: string) => void,
    keyboardType?: any,
    placeholder?: string,
    editable?: boolean,
    onPress?: () => void,
    isButton?: boolean,
    maxLength?: number
}) {
    return (
        <View style={styles.profileItem}>
            <View style={styles.iconContainer}>
                <Ionicons name={icon} size={24} color="#e83e8c" />
            </View>
            <View style={styles.infoContainer}>
                <ThemedText style={styles.label}>{label}</ThemedText>
                {isEditing && editable ? (
                    isButton ? (
                        <TouchableOpacity onPress={onPress} style={styles.inputFieldButton}>
                            <ThemedText style={[styles.value, !value && styles.placeholderText]}>
                                {value || placeholder || ''}
                            </ThemedText>
                            <Ionicons name="calendar-outline" size={18} color="#e83e8c" style={{ marginLeft: 'auto' }} />
                        </TouchableOpacity>
                    ) : (
                        <TextInput
                            style={styles.inputField}
                            value={value}
                            onChangeText={onChangeText}
                            keyboardType={keyboardType}
                            placeholder={placeholder}
                            placeholderTextColor="#aaa"
                            maxLength={maxLength}
                        />
                    )
                ) : (
                    <ThemedText style={[styles.value, !editable && styles.readOnlyValue]}>{value}</ThemedText>
                )}
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
    inputField: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
        borderBottomWidth: 1,
        borderBottomColor: '#e83e8c',
        paddingVertical: 2,
        paddingHorizontal: 0,
        width: '100%',
    },
    inputFieldButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e83e8c',
        paddingVertical: 2,
        width: '100%',
    },
    placeholderText: {
        color: '#aaa',
    },
    readOnlyValue: {
        color: '#777',
    },
    actionButtonsContainer: {
        alignItems: 'center',
        marginBottom: 24,
        width: '100%',
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e83e8c',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        shadowColor: '#e83e8c',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    editingButtonsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        width: '100%',
    },
    cancelButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#8F9BB3',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2E8B57',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        shadowColor: '#2E8B57',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    actionButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
