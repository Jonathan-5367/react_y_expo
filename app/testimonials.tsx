import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Image } from 'expo-image';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SideMenu } from '@/components/SideMenu';
import Ionicons from '@expo/vector-icons/Ionicons';

const testimonials = [
    {
        id: 1,
        name: 'Ana García',
        role: 'Paciente de Ortodoncia',
        text: '¡Mi sonrisa cambió por completo! El tratamiento fue mucho más rápido de lo que esperaba y la atención de la Dra. López fue excelente.',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
    },
    {
        id: 2,
        name: 'Carlos Rodríguez',
        role: 'Paciente de Implantes',
        text: 'Recuperé la confianza para sonreír. El procedimiento fue indoloro y los resultados se ven increíblemente naturales.',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    },
    {
        id: 3,
        name: 'Lucía Fernández',
        role: 'Madre de Paciente',
        text: 'La Dra. tiene un trato maravilloso con los niños. Mi hijo va feliz a sus consultas de revisión. ¡Totalmente recomendada!',
        avatar: 'https://i.pravatar.cc/150?u=a04258114e29026302d',
    },
    {
        id: 4,
        name: 'Miguel Ángel',
        role: 'Diseño de Sonrisa',
        text: 'Gracias al blanqueamiento y las carillas, tengo la sonrisa que siempre soñé. Un servicio profesional y de alta calidad.',
        avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d',
    },
];

export default function TestimonialsScreen() {
    const insets = useSafeAreaInsets();
    const [isMenuVisible, setIsMenuVisible] = useState(false);

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
                    <ThemedText type="title" style={styles.title}>Lo que dicen nuestros usuarios</ThemedText>
                    <ThemedText style={styles.subtitle}>Historias reales de personas reales.</ThemedText>
                </View>

                <View style={styles.grid}>
                    {testimonials.map((item) => (
                        <View key={item.id} style={styles.card}>
                            <View style={styles.cardHeader}>
                                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                                <View>
                                    <ThemedText style={styles.name}>{item.name}</ThemedText>
                                    <ThemedText style={styles.role}>{item.role}</ThemedText>
                                </View>
                            </View>
                            <ThemedText style={styles.text}>"{item.text}"</ThemedText>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF0F6', // Light pink to match Login/Register
    },
    scrollContent: {
        padding: 30,
        alignItems: 'center',
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
        marginTop: 20,
        width: '100%',
        maxWidth: 600,
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
    grid: {
        gap: 20,
        width: '100%',
        maxWidth: 600,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 3,
        marginBottom: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
        backgroundColor: '#E0E0E0',
    },
    name: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#333',
    },
    role: {
        fontSize: 12,
        color: '#666',
    },
    text: {
        fontSize: 14,
        lineHeight: 22,
        color: '#444',
        fontStyle: 'italic',
    },
});
