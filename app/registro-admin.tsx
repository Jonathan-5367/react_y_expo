import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View, Alert, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth, UserRole } from '@/store/auth';
import { SideMenu } from '@/components/SideMenu';
import { NotifBell } from '@/components/NotifBell';
import { DropdownSelector } from '@/components/DropdownSelector';

export default function RegistroAdminScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { user, registerAdmin } = useAuth();
    const [isMenuVisible, setIsMenuVisible] = useState(false);

    const [nombre, setNombre] = useState('');
    const [cedula, setCedula] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [telefono, setTelefono] = useState('');
    const [rol, setRol] = useState<UserRole>('administrador');
    const [isRolDropdownVisible, setIsRolDropdownVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    // Access control: only admins and doctors allowed
    useEffect(() => {
        if (!user || (user.rol !== 'administrador' && user.rol !== 'doctor')) {
            Alert.alert('Acceso Denegado', 'Esta sección es exclusiva para administradores y doctores.', [
                { text: 'Aceptar', onPress: () => router.replace('/login') }
            ]);
        }
    }, [user]);

    const handleRegisterAdmin = async () => {
        if (!nombre.trim() || !cedula.trim() || !email.trim() || !password.trim()) {
            Alert.alert('Campos requeridos', 'Por favor, llena los campos obligatorios: Nombre, Cédula, Correo y Contraseña.');
            return;
        }

        setLoading(true);
        try {
            const result = await registerAdmin({
                nombre: nombre.trim(),
                cedula: cedula.trim(),
                email: email.trim().toLowerCase(),
                password: password.trim(),
                telefono: telefono.trim(),
                rol: rol,
            });

            if (result.success) {
                Alert.alert('Registro Exitoso', `El usuario ${nombre} con el rol de ${rol} ha sido creado con éxito.`, [
                    { text: 'Aceptar', onPress: () => router.back() }
                ]);
            } else {
                Alert.alert('Error al Registrar', result.error || 'Ocurrió un error inesperado.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (!user || (user.rol !== 'administrador' && user.rol !== 'doctor')) {
        return null; // Don't render anything while redirecting
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

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <View style={styles.adminIconCircle}>
                        <Ionicons name="shield-checkmark" size={40} color="#e83e8c" />
                    </View>
                    <ThemedText type="title" style={styles.title}>Registrar Admin</ThemedText>
                    <ThemedText style={styles.subtitle}>Crea una nueva cuenta con privilegios de administrador para el sistema.</ThemedText>
                </View>

                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <ThemedText style={styles.label}>Nombre Completo *</ThemedText>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej. Dra. María Silva"
                            placeholderTextColor="#888"
                            value={nombre}
                            onChangeText={setNombre}
                            maxLength={50}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <ThemedText style={styles.label}>Cédula *</ThemedText>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej. 12345678"
                            placeholderTextColor="#888"
                            value={cedula}
                            onChangeText={setCedula}
                            keyboardType="numeric"
                            maxLength={8}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <ThemedText style={styles.label}>Correo Electrónico *</ThemedText>
                        <TextInput
                            style={styles.input}
                            placeholder="admin@ejemplo.com"
                            placeholderTextColor="#888"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <ThemedText style={styles.label}>Contraseña *</ThemedText>
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            placeholderTextColor="#888"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <ThemedText style={styles.label}>Teléfono de Contacto</ThemedText>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej. 04141234567"
                            placeholderTextColor="#888"
                            value={telefono}
                            onChangeText={setTelefono}
                            keyboardType="phone-pad"
                            maxLength={11}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <ThemedText style={styles.label}>Selecciona un Rol *</ThemedText>
                        <TouchableOpacity
                            style={styles.dropdownInputButton}
                            onPress={() => setIsRolDropdownVisible(true)}
                        >
                            <Text style={styles.inputText}>
                                {rol === 'administrador' ? 'Administrador' : rol.charAt(0).toUpperCase() + rol.slice(1)}
                            </Text>
                            <Ionicons name="chevron-down" size={20} color="#e83e8c" />
                        </TouchableOpacity>
                        <DropdownSelector
                            visible={isRolDropdownVisible}
                            onClose={() => setIsRolDropdownVisible(false)}
                            selectedValue={rol}
                            onSelect={(val) => setRol(val as UserRole)}
                            title="Selecciona el rol del nuevo usuario"
                            options={[
                                { label: 'Administrador', value: 'administrador' },
                                { label: 'Doctor', value: 'doctor' },
                                { label: 'Recepcionista', value: 'recepcionista' },
                                { label: 'Paciente', value: 'paciente' }
                            ]}
                        />
                    </View>

                    <TouchableOpacity style={[styles.button, loading && { opacity: 0.6 }]} onPress={handleRegisterAdmin} disabled={loading}>
                        <ThemedText style={styles.buttonText}>{loading ? 'Creando...' : 'Crear Usuario'}</ThemedText>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF0F6', // Light pink background
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 40,
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 0,
    },
    backButton: {
        padding: 4,
    },
    menuButton: {
        padding: 4,
    },
    header: {
        alignItems: 'center',
        marginBottom: 28,
        marginTop: 10,
    },
    adminIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        shadowColor: '#e83e8c',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 4,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#e83e8c',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        lineHeight: 20,
        paddingHorizontal: 10,
    },
    formContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
        gap: 16,
    },
    inputContainer: {
        gap: 6,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    input: {
        height: 50,
        backgroundColor: '#F9F9F9',
        borderRadius: 8,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        fontSize: 16,
        color: '#333',
    },
    button: {
        backgroundColor: '#e83e8c',
        height: 54,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
        shadowColor: '#e83e8c',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    dropdownInputButton: {
        height: 50,
        backgroundColor: '#F9F9F9',
        borderRadius: 8,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        alignSelf: 'stretch',
    },
    inputText: {
        fontSize: 16,
        color: '#333333',
        flex: 1,
        textAlign: 'left',
    },
});
