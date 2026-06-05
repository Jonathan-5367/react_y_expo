import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/store/auth';

export default function LoginScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const handleLogin = () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Campos requeridos', 'Por favor, introduce tu correo y contraseña.');
            return;
        }
        const result = login(email, password);
        if (result.success) {
            router.replace('/dashboard');
        } else {
            Alert.alert('Error de Inicio de Sesión', result.error || 'Credenciales inválidas');
        }
    };

    return (
        <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
            <Stack.Screen options={{ headerShown: false }} />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <View style={styles.logoCircle}>
                        <Ionicons name="medical" size={40} color="#e83e8c" />
                    </View>
                    <ThemedText style={styles.clinicName}>CONSULTORIO ODONTOLÓGICO</ThemedText>
                    <ThemedText type="title" style={styles.title}>Dra. Nazaret Lopez</ThemedText>
                    <ThemedText style={styles.subtitle}>Inicia sesión para continuar</ThemedText>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <ThemedText style={styles.label}>Correo Electrónico</ThemedText>
                        <TextInput
                            style={styles.input}
                            placeholder="tu@correo.com"
                            placeholderTextColor="#888"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoComplete="email"
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
                            autoComplete="password"
                        />
                    </View>

                    <TouchableOpacity style={styles.rememberMe} onPress={() => setRememberMe(!rememberMe)}>
                        <Ionicons name={rememberMe ? "checkbox" : "square-outline"} size={20} color="#e83e8c" />
                        <ThemedText style={styles.rememberText}>Recuérdame</ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.forgotPassword}>
                        <ThemedText style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <ThemedText style={styles.buttonText}>Entrar</ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.push('/register')} style={styles.linkButton}>
                        <ThemedText style={styles.linkText}>¿No tienes cuenta? Regístrate</ThemedText>
                    </TouchableOpacity>

                    {/* Test Accounts Info Box */}
                    <View style={styles.infoBox}>
                        <View style={styles.infoBoxHeader}>
                            <Ionicons name="information-circle" size={18} color="#e83e8c" />
                            <ThemedText style={styles.infoBoxTitle}>Cuentas de prueba:</ThemedText>
                        </View>
                        <ThemedText style={styles.infoBoxText}>
                            🔑 <ThemedText style={styles.boldText}>Paciente:</ThemedText> paciente@paciente.com / password
                        </ThemedText>
                        <ThemedText style={styles.infoBoxText}>
                            🔑 <ThemedText style={styles.boldText}>Admin:</ThemedText> admin@admin.com / admin
                        </ThemedText>
                    </View>
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
        padding: 3,
    },
    header: {
        marginBottom: 40,
        alignItems: 'center',
        width: '100%',
        maxWidth: 400,
    },
    logoCircle: {
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
    clinicName: {
        fontSize: 12,
        fontWeight: '800',
        color: '#888',
        letterSpacing: 3,
        marginBottom: 4,
        textAlign: 'center',
    },
    title: {
        fontSize: 34,
        fontWeight: '900',
        color: '#e83e8c',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        opacity: 0.7,
        textAlign: 'center',
        fontSize: 18,
    },
    form: {
        gap: 20,
        width: '100%',
        maxWidth: 320,
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
        height: 52,
        backgroundColor: '#ffffffff',
        borderRadius: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#E4E9F2',
        fontSize: 16,
    },
    rememberMe: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 10,
    },
    rememberText: {
        fontSize: 14,
        color: '#333',
    },
    forgotPassword: {
        alignItems: 'center',
        marginTop: 16,
    },
    forgotPasswordText: {
        color: '#8F9BB3',
        fontSize: 14,
    },
    button: {
        backgroundColor: '#e83e8c', // Primary pink
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
        shadowColor: '#e83e8c',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
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
    infoBox: {
        backgroundColor: '#FFF5F9',
        borderWidth: 1,
        borderColor: '#FFD3E8',
        borderRadius: 12,
        padding: 12,
        marginTop: 8,
        gap: 4,
    },
    infoBoxHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },
    infoBoxTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#e83e8c',
    },
    infoBoxText: {
        fontSize: 12,
        color: '#555',
    },
    boldText: {
        fontWeight: 'bold',
        color: '#e83e8c',
    },
});
