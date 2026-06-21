import { CalendarModal } from '@/components/CalendarModal';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/store/auth';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function RegisterScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { registerPatient } = useAuth();
    const [name, setName] = useState('');
    const [cedula, setCedula] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [telefono, setTelefono] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [telefonoFamiliar, setTelefonoFamiliar] = useState('');
    const [alergias, setAlergias] = useState('');
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!name.trim() || !cedula.trim() || !email.trim() || !password.trim()) {
            Alert.alert('Campos requeridos', 'Por favor, llena los campos obligatorios: Nombre, Cédula, Correo y Contraseña.');
            return;
        }

        setLoading(true);
        try {
            const result = await registerPatient({
                nombre: name,
                cedula,
                email,
                password,
                telefono,
                fechaNacimiento,
                telefonoFamiliar,
                alergias
            });

            if (result.success) {
                Alert.alert('Registro Exitoso', 'Tu cuenta de paciente ha sido creada con éxito.', [
                    { text: 'OK', onPress: () => router.replace('/login') }
                ]);
            } else {
                Alert.alert('Error al Registrarse', result.error || 'Ocurrió un error inesperado.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
            <Stack.Screen options={{ title: 'Registro', headerTransparent: true }} />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <ThemedText type="title" style={styles.title}>Crear Cuenta</ThemedText>
                    <ThemedText style={styles.subtitle}>Únete a nuestra comunidad hoy mismo.</ThemedText>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <ThemedText style={styles.label}>Nombre Completo</ThemedText>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej. Juan Pérez"
                            placeholderTextColor="#888"
                            value={name}
                            onChangeText={setName}
                            maxLength={50}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <ThemedText style={styles.label}>Cédula</ThemedText>
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
                        <ThemedText style={styles.label}>Correo Electrónico</ThemedText>
                        <TextInput
                            style={styles.input}
                            placeholder="correo@ejemplo.com"
                            placeholderTextColor="#888"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <ThemedText style={styles.label}>Contraseña</ThemedText>
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
                        <ThemedText style={styles.label}>Número de Contacto</ThemedText>
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
                        <ThemedText style={styles.label}>Fecha de Nacimiento</ThemedText>
                        <TouchableOpacity
                            style={styles.calendarInputButton}
                            onPress={() => setIsCalendarVisible(true)}
                        >
                            <Text style={fechaNacimiento ? styles.inputText : styles.placeholderText}>
                                {fechaNacimiento || "Seleccionar fecha (AAAA-MM-DD)"}
                            </Text>
                            <Ionicons name="calendar-outline" size={20} color="#e83e8c" />
                        </TouchableOpacity>
                        <CalendarModal
                            visible={isCalendarVisible}
                            onClose={() => setIsCalendarVisible(false)}
                            onSelectDate={(date) => setFechaNacimiento(date)}
                            initialDate={fechaNacimiento || "1995-01-01"}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <ThemedText style={styles.label}>Número de Familiar</ThemedText>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej. 04141234567"
                            placeholderTextColor="#888"
                            value={telefonoFamiliar}
                            onChangeText={setTelefonoFamiliar}
                            keyboardType="phone-pad"
                            maxLength={11}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <ThemedText style={styles.label}>Alergias Conocidas</ThemedText>
                        <TextInput
                            style={styles.textArea}
                            placeholder="Ej. Penicilina, látex, anestesia local..."
                            placeholderTextColor="#888"
                            value={alergias}
                            onChangeText={setAlergias}
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                        />
                    </View>

                    <TouchableOpacity style={[styles.button, loading && { opacity: 0.6 }]} onPress={handleRegister} disabled={loading}>
                        <ThemedText style={styles.buttonText}>{loading ? 'Registrando...' : 'Registrarse'}</ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.push('/login')} style={styles.linkButton}>
                        <ThemedText style={styles.linkText}>¿Ya tienes cuenta? Inicia Sesión</ThemedText>
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
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },
    header: {
        marginBottom: 32,
        alignItems: 'center',
        width: '100%',
        maxWidth: 400,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginTop: 60,
        marginBottom: 8,
        color: '#e83e8c', // Primary pink
    },
    subtitle: {
        opacity: 0.7,
        textAlign: 'center',
        fontSize: 18,
    },
    form: {
        gap: 20,
        width: '100%',
        maxWidth: 400,
    },
    inputContainer: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
        color: '#101010ff',
    },
    input: {
        height: 50,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#E1E4E8',
        fontSize: 16,
    },
    textArea: {
        minHeight: 100,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#E1E4E8',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#e83e8c',
        height: 56,
        borderRadius: 12,
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
        fontSize: 20,
        fontWeight: 'bold',
    },
    linkButton: {
        alignItems: 'center',
        padding: 12,
    },
    linkText: {
        color: '#e83e8c',
        fontSize: 16,
        fontWeight: '600',
    },
    calendarInputButton: {
        height: 50,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#E1E4E8',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    inputText: {
        fontSize: 16,
        color: '#333333',
    },
    placeholderText: {
        fontSize: 16,
        color: '#888888',
    },
});
