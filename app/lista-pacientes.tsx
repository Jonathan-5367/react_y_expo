import { NotifBell } from '@/components/NotifBell';
import { SideMenu } from '@/components/SideMenu';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { API_URL, useProtectedRoute } from '@/store/auth';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ListaPacientesScreen() {
    const user = useProtectedRoute();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('Todos');
    const [pacientes, setPacientes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPatients = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/patients`);
            if (!response.ok) {
                throw new Error('No se pudo obtener el listado de pacientes.');
            }
            const data = await response.json();
            setPacientes(data);
        } catch (err: any) {
            console.error('Error fetching patients:', err);
            setError(err.message || 'Error al conectar con el servidor.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user) return;

        // Guard check: only allow administrador or doctor
        if (user.rol !== 'administrador' && user.rol !== 'doctor') {
            router.replace('/dashboard');
            return;
        }

        fetchPatients();
    }, [user]);

    if (!user || (user.rol !== 'administrador' && user.rol !== 'doctor')) {
        return null; // Don't render while redirecting
    }

    // Search across name, cedula, and phone
    const query = searchQuery.toLowerCase().trim();
    let filteredPacientes = pacientes.filter(p => {
        if (!query) return true;
        const name = (p.name || '').toLowerCase();
        const cedula = (p.cedula || '').toLowerCase();
        const phone = (p.phone || '').toLowerCase();
        return name.includes(query) || cedula.includes(query) || phone.includes(query);
    });

    // Apply category filter
    if (filterType === 'Con Citas') {
        filteredPacientes = filteredPacientes.filter(p => p.lastVisit && p.lastVisit !== 'Sin citas');
    } else if (filterType === 'Sin Citas') {
        filteredPacientes = filteredPacientes.filter(p => !p.lastVisit || p.lastVisit === 'Sin citas');
    } else if (filterType === 'Mayores de 30') {
        filteredPacientes = filteredPacientes.filter(p => p.age > 0 && p.age >= 30);
    } else if (filterType === 'Menores de 30') {
        filteredPacientes = filteredPacientes.filter(p => p.age > 0 && p.age < 30);
    } else if (filterType === 'Con Fecha Nac.') {
        filteredPacientes = filteredPacientes.filter(p => p.age > 0);
    }

    // Filter options with descriptions
    const filterOptions = [
        { key: 'Todos', icon: 'people-outline' as const },
        { key: 'Con Citas', icon: 'checkmark-circle-outline' as const },
        { key: 'Sin Citas', icon: 'alert-circle-outline' as const },
        { key: 'Mayores de 30', icon: 'arrow-up-outline' as const },
        { key: 'Menores de 30', icon: 'arrow-down-outline' as const },
        { key: 'Con Fecha Nac.', icon: 'calendar-outline' as const },
    ];

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
                    <ThemedText type="title" style={styles.title}>Lista de Pacientes</ThemedText>
                    <ThemedText style={styles.subtitle}>Directorio de pacientes registrados en la clínica</ThemedText>
                </View>

                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar: Nombre, CI o Tlf."
                        placeholderTextColor="#888"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={20} color="#aaa" />
                        </TouchableOpacity>
                    )}
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContainer}>
                    {filterOptions.map(({ key, icon }) => (
                        <TouchableOpacity
                            key={key}
                            style={[styles.filterChip, filterType === key && styles.filterChipActive]}
                            onPress={() => setFilterType(key)}
                        >
                            <Ionicons name={icon} size={14} color={filterType === key ? '#FFF' : '#888'} style={{ marginRight: 4 }} />
                            <ThemedText style={[styles.filterText, filterType === key && styles.filterTextActive]}>{key}</ThemedText>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {!loading && !error && (
                    <ThemedText style={styles.resultCount}>
                        {filteredPacientes.length} {filteredPacientes.length === 1 ? 'paciente encontrado' : 'pacientes encontrados'}
                    </ThemedText>
                )}

                <View style={styles.listContainer}>
                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#e83e8c" />
                            <ThemedText style={styles.loadingText}>Cargando pacientes...</ThemedText>
                        </View>
                    ) : error ? (
                        <View style={styles.errorContainer}>
                            <Ionicons name="alert-circle-outline" size={40} color="#D32F2F" />
                            <ThemedText style={styles.errorText}>{error}</ThemedText>
                            <TouchableOpacity style={styles.retryButton} onPress={fetchPatients}>
                                <ThemedText style={styles.retryButtonText}>Reintentar</ThemedText>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <>
                            {filteredPacientes.map((paciente) => (
                                <TouchableOpacity 
                                    key={paciente.id} 
                                    style={styles.card}
                                    onPress={() => router.push(`/paciente/${paciente.id}` as any)}
                                >
                                    <View style={styles.avatar}>
                                        <ThemedText style={styles.avatarText}>{(paciente.name || '').charAt(0)}</ThemedText>
                                    </View>
                                    <View style={styles.infoContainer}>
                                        <ThemedText style={styles.patientName}>{paciente.name}</ThemedText>
                                        <ThemedText style={styles.patientDetails}>C.I: {paciente.cedula} | Edad: {paciente.age} años | Tel: {paciente.phone}</ThemedText>
                                    </View>
                                    <Ionicons name="chevron-forward" size={24} color="#ccc" />
                                </TouchableOpacity>
                            ))}
                            {filteredPacientes.length === 0 && (
                                <ThemedText style={styles.emptyText}>No se encontraron pacientes.</ThemedText>
                            )}
                        </>
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
        justifyContent: 'space-between',
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
        marginBottom: 16,
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
    filterScroll: {
        marginBottom: 12,
    },
    filterContainer: {
        gap: 12,
        paddingRight: 24, // extra padding for scrolling
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    filterChipActive: {
        backgroundColor: '#e83e8c',
        borderColor: '#e83e8c',
    },
    filterText: {
        fontSize: 14,
        color: '#555',
        fontWeight: '600',
    },
    filterTextActive: {
        color: '#FFFFFF',
    },
    resultCount: {
        fontSize: 13,
        color: '#999',
        marginBottom: 16,
        fontWeight: '500',
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
    loadingContainer: {
        paddingVertical: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        color: '#e83e8c',
        fontWeight: 'bold',
    },
    errorContainer: {
        paddingVertical: 30,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    errorText: {
        fontSize: 16,
        color: '#D32F2F',
        textAlign: 'center',
        fontWeight: '500',
    },
    retryButton: {
        backgroundColor: '#e83e8c',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 8,
        alignItems: 'center',
    },
    retryButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
});
