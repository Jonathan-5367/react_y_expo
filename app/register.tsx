import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function RegisterScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [name, setName] = useState('');
    const [cedula, setCedula] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [telefono, setTelefono] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [telefonoFamiliar, setTelefonoFamiliar] = useState('');
    const [alergias, setAlergias] = useState('');

    const handleRegister = () => {
        // Implement registration logic here
        console.log('Registering:', { name, cedula, email, password, telefono, fechaNacimiento, telefonoFamiliar, alergias });
        router.replace('/login'); // Navigate to login after registration
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
                        <TextInput
                            style={styles.input}
                            placeholder="AAAA-MM-DD"
                            placeholderTextColor="#888"
                            value={fechaNacimiento}
                            onChangeText={setFechaNacimiento}
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

                    <TouchableOpacity style={styles.button} onPress={handleRegister}>
                        <ThemedText style={styles.buttonText}>Registrarse</ThemedText>
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
});
