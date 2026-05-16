import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker'; // Optional if they don't have it installed we will use simple text inputs or simulate a picker

export default function AgendarCitasScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [procedimiento, setProcedimiento] = useState('');

    const handleAgendar = () => {
        console.log('Agendando cita:', { fecha, hora, procedimiento });
        router.back();
    };

    return (
        <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
            <Stack.Screen options={{ title: 'Agendar Cita', headerTransparent: true }} />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#e83e8c" />
                    <ThemedText style={styles.backText}>Volver</ThemedText>
                </TouchableOpacity>

                <View style={styles.header}>
                    <ThemedText type="title" style={styles.title}>Agendar Nueva Cita</ThemedText>
                    <ThemedText style={styles.subtitle}>Agenda tu cita de manera fácil y rápida.</ThemedText>
                </View>

                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <ThemedText style={styles.label}>Nombre completo del paciente:</ThemedText>
                        <TextInput style={[styles.input, styles.readOnlyInput]} value="Juan Pérez" editable={false} />
                    </View>

                    <View style={styles.inputContainer}>
                        <ThemedText style={styles.label}>Número de teléfono (WhatsApp):</ThemedText>
                        <TextInput style={styles.input} defaultValue="04141234567" keyboardType="phone-pad" />
                    </View>

                    <View style={styles.inputContainer}>
                        <ThemedText style={styles.label}>Correo electrónico:</ThemedText>
                        <TextInput style={[styles.input, styles.readOnlyInput]} value="juan.perez@ejemplo.com" editable={false} />
                    </View>

                    <View style={styles.inputContainer}>
                        <ThemedText style={styles.label}>Fecha de la cita:</ThemedText>
                        <TextInput 
                            style={styles.input} 
                            placeholder="AAAA-MM-DD" 
                            placeholderTextColor="#888"
                            value={fecha}
                            onChangeText={setFecha}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <ThemedText style={styles.label}>Hora de la cita:</ThemedText>
                        <TextInput 
                            style={styles.input} 
                            placeholder="Ej: 14:30" 
                            placeholderTextColor="#888"
                            value={hora}
                            onChangeText={setHora}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <ThemedText style={styles.label}>Tipo de procedimiento:</ThemedText>
                        <TextInput 
                            style={styles.input} 
                            placeholder="Ej: Limpieza dental, Ortodoncia..." 
                            placeholderTextColor="#888"
                            value={procedimiento}
                            onChangeText={setProcedimiento}
                        />
                    </View>

                    <TouchableOpacity style={styles.button} onPress={handleAgendar}>
                        <ThemedText style={styles.buttonText}>Agendar Cita</ThemedText>
                    </TouchableOpacity>
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
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    backText: {
        marginLeft: 8,
        color: '#e83e8c',
        fontSize: 16,
        fontWeight: 'bold',
    },
    header: {
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
    },
    formContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 3,
        gap: 16,
    },
    inputContainer: {
        gap: 8,
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
    readOnlyInput: {
        backgroundColor: '#F0F0F0',
        color: '#888',
    },
    button: {
        backgroundColor: '#e83e8c',
        height: 56,
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
});
