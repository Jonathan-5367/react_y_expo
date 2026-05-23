import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SideMenu } from '@/components/SideMenu';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ListaPacientesScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const pacientes = [
        { id: '1', name: 'Ana Gómez', age: 34, phone: '555-0101', lastVisit: '10 May 2026' },
        { id: '2', name: 'Carlos Ruiz', age: 45, phone: '555-0202', lastVisit: '02 May 2026' },
        { id: '3', name: 'María Fernández', age: 28, phone: '555-0303', lastVisit: '28 Abr 2026' },
        { id: '4', name: 'Roberto Sánchez', age: 52, phone: '555-0404', lastVisit: '15 Abr 2026' },
        { id: '5', name: 'Lucía Morales', age: 21, phone: '555-0505', lastVisit: '05 Abr 2026' },
    ];

    const filteredPacientes = pacientes.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

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
                    <ThemedText type="title" style={styles.title}>Lista de Pacientes</ThemedText>
                    <ThemedText style={styles.subtitle}>Directorio de pacientes registrados en la clínica</ThemedText>
                </View>

                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar por nombre..."
                        placeholderTextColor="#888"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <View style={styles.listContainer}>
                    {filteredPacientes.map((paciente) => (
                        <TouchableOpacity key={paciente.id} style={styles.card}>
                            <View style={styles.avatar}>
                                <ThemedText style={styles.avatarText}>{paciente.name.charAt(0)}</ThemedText>
                            </View>
                            <View style={styles.infoContainer}>
                                <ThemedText style={styles.patientName}>{paciente.name}</ThemedText>
                                <ThemedText style={styles.patientDetails}>Edad: {paciente.age} años | Tel: {paciente.phone}</ThemedText>
                            </View>
                            <Ionicons name="chevron-forward" size={24} color="#ccc" />
                        </TouchableOpacity>
                    ))}
                    {filteredPacientes.length === 0 && (
                        <ThemedText style={styles.emptyText}>No se encontraron pacientes.</ThemedText>
                    )}
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
        fontSize: 32,
        fontWeight: 'bold',
        color: '#e83e8c',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 16,
        marginBottom: 24,
        height: 50,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    listContainer: {
        gap: 12,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FFE5F0',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    avatarText: {
        color: '#e83e8c',
        fontWeight: 'bold',
        fontSize: 20,
    },
    infoContainer: {
        flex: 1,
    },
    patientName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    patientDetails: {
        fontSize: 14,
        color: '#888',
    },
    emptyText: {
        textAlign: 'center',
        color: '#888',
        fontSize: 16,
        marginTop: 20,
    },
});
