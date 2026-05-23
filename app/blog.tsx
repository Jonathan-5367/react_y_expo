import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Image } from 'expo-image';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SideMenu } from '@/components/SideMenu';
import Ionicons from '@expo/vector-icons/Ionicons';

const posts = [
    {
        id: 1,
        title: 'Ortodoncia Invisible: Lo que debes saber',
        excerpt: 'Descubre cómo los alineadores transparentes pueden mejorar tu sonrisa sin que nadie lo note. La tecnología 3D al servicio de tu estética.',
        date: 'Oct 12, 2025',
        likes: 120,
        readTime: '5 min',
        image: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 2,
        title: '5 Consejos para un Blanqueamiento Seguro',
        excerpt: 'No todos los métodos caseros son seguros. Aprende cómo aclarar tus dientes sin dañar el esmalte y evitando la sensibilidad dental.',
        date: 'Sep 25, 2025',
        likes: 85,
        readTime: '4 min',
        image: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 3,
        title: 'La Importancia de la Higiene Infantil',
        excerpt: 'Crear hábitos saludables desde pequeños es fundamental. Guía práctica para padres sobre el cuidado de los dientes de leche.',
        date: 'Ago 15, 2025',
        likes: 210,
        readTime: '6 min',
        image: 'https://images.unsplash.com/photo-1571772996211-2f02c9727629?auto=format&fit=crop&w=400&q=80',
    },
];

export default function BlogScreen() {
    const router = useRouter();
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
                    <ThemedText type="title" style={styles.title}>Blog</ThemedText>
                    <ThemedText style={styles.subtitle}>Noticias, actualizaciones y conocimientos.</ThemedText>
                </View>

                <View style={styles.list}>
                    {posts.map((post) => (
                        <TouchableOpacity key={post.id} style={styles.card} onPress={() => console.log('Open post', post.id)}>
                            <Image source={{ uri: post.image }} style={styles.cardImage} />
                            <View style={styles.cardContent}>
                                <View style={styles.metaRow}>
                                    <ThemedText style={styles.metaText}>{post.date} • {post.readTime}</ThemedText>
                                </View>
                                <ThemedText type="subtitle" style={styles.cardTitle}>{post.title}</ThemedText>
                                <ThemedText style={styles.excerpt} numberOfLines={3}>{post.excerpt}</ThemedText>
                                <View style={styles.footerRow}>
                                    <ThemedText style={styles.readMore}>Leer más →</ThemedText>
                                    <ThemedText style={styles.likes}>❤️ {post.likes}</ThemedText>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
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
        marginBottom: 24,
        marginTop: 20,
        width: '100%',
        maxWidth: 600,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginTop: 30,
        marginBottom: 8,
        color: '#e83e8c', // Primary pink
    },
    subtitle: {
        opacity: 0.7,
        fontSize: 18,
    },
    list: {
        gap: 24,
        width: '100%',
        maxWidth: 600,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 5,
    },
    cardImage: {
        width: '100%',
        height: 180,
        backgroundColor: '#EEE',
    },
    cardContent: {
        padding: 20,
    },
    metaRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    metaText: {
        fontSize: 12,
        color: '#888',
        textTransform: 'uppercase',
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    cardTitle: {
        marginBottom: 8,
        fontSize: 20,
        lineHeight: 28,
    },
    excerpt: {
        fontSize: 14,
        color: '#555',
        lineHeight: 22,
        marginBottom: 16,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        paddingTop: 12,
    },
    readMore: {
        color: '#e83e8c',
        fontWeight: 'bold',
        fontSize: 16,
    },
    likes: {
        fontSize: 12,
        color: '#666',
    },
});
