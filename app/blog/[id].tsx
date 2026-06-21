import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { posts } from '../blog'; // Import the posts array

export default function BlogPostScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    
    // Find the post by ID
    const post = posts.find(p => p.id === Number(id));

    if (!post) {
        return (
            <ThemedView style={[styles.container, { paddingTop: insets.top, justifyContent: 'center', alignItems: 'center' }]}>
                <Ionicons name="document-text-outline" size={60} color="#ccc" />
                <ThemedText style={{ marginTop: 16, fontSize: 18, color: '#888' }}>Artículo no encontrado</ThemedText>
                <TouchableOpacity style={styles.backButtonCenter} onPress={() => router.back()}>
                    <ThemedText style={styles.backTextCenter}>Volver al Blog</ThemedText>
                </TouchableOpacity>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
            <Stack.Screen options={{ headerShown: false }} />
            
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#e83e8c" />
                    <ThemedText style={styles.backText}>Volver</ThemedText>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Image source={{ uri: post.image }} style={styles.heroImage} />
                
                <View style={styles.contentContainer}>
                    <ThemedText type="title" style={styles.title}>{post.title}</ThemedText>
                    
                    <View style={styles.metaRow}>
                        <View style={styles.authorContainer}>
                            <Ionicons name="person-circle-outline" size={20} color="#e83e8c" />
                            <ThemedText style={styles.authorText}>{post.author}</ThemedText>
                        </View>
                        <ThemedText style={styles.dateText}>{post.date} • {post.readTime}</ThemedText>
                    </View>
                    
                    <View style={styles.divider} />
                    
                    {/* Render content paragraphs */}
                    {post.content.split('\n\n').map((paragraph, index) => {
                        // Simple parser for bold text if using markdown-like syntax **bold**
                        const parts = paragraph.split(/(\*\*.*?\*\*)/g);
                        
                        return (
                            <ThemedText key={index} style={styles.paragraph}>
                                {parts.map((part, i) => {
                                    if (part.startsWith('**') && part.endsWith('**')) {
                                        return <ThemedText key={i} style={styles.boldText}>{part.slice(2, -2)}</ThemedText>;
                                    }
                                    return part;
                                })}
                            </ThemedText>
                        );
                    })}

                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.likeButton}>
                            <Ionicons name="heart-outline" size={24} color="#e83e8c" />
                            <ThemedText style={styles.likesText}>{post.likes} Me gusta</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.shareButton}>
                            <Ionicons name="share-social-outline" size={24} color="#555" />
                            <ThemedText style={styles.shareText}>Compartir</ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
    },
    backText: {
        color: '#e83e8c',
        fontWeight: 'bold',
        marginLeft: 4,
        fontSize: 16,
    },
    backButtonCenter: {
        marginTop: 20,
        backgroundColor: '#FFE5F0',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    backTextCenter: {
        color: '#e83e8c',
        fontWeight: 'bold',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    heroImage: {
        width: '100%',
        height: 250,
        backgroundColor: '#EEE',
    },
    contentContainer: {
        padding: 24,
    },
    title: {
        fontSize: 28,
        lineHeight: 34,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    authorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    authorText: {
        fontSize: 14,
        color: '#555',
        fontWeight: '600',
        marginLeft: 6,
    },
    dateText: {
        fontSize: 14,
        color: '#888',
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginBottom: 24,
    },
    paragraph: {
        fontSize: 16,
        lineHeight: 26,
        color: '#444',
        marginBottom: 16,
    },
    boldText: {
        fontWeight: 'bold',
        color: '#222',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 32,
        paddingTop: 24,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    likeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFE5F0',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    likesText: {
        marginLeft: 8,
        color: '#e83e8c',
        fontWeight: 'bold',
    },
    shareButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    shareText: {
        marginLeft: 8,
        color: '#555',
        fontWeight: '600',
    },
});
