import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Image } from 'expo-image';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SideMenu } from '@/components/SideMenu';
import { NotifBell } from '@/components/NotifBell';
import Ionicons from '@expo/vector-icons/Ionicons';

export const posts = [
    {
        id: 1,
        title: 'Ortodoncia Invisible: Lo que debes saber',
        excerpt: 'Descubre cómo los alineadores transparentes pueden mejorar tu sonrisa sin que nadie lo note. La tecnología 3D al servicio de tu estética.',
        date: 'Oct 12, 2025',
        author: 'Dra. Nazaret Lopez',
        likes: 120,
        readTime: '5 min',
        image: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=400&q=80',
        content: `La ortodoncia invisible ha revolucionado la forma en que corregimos la alineación dental. A diferencia de los brackets metálicos tradicionales, este método utiliza una serie de alineadores transparentes hechos a medida. 

**¿Cómo funciona?**
Los alineadores aplican fuerzas controladas y graduales sobre los dientes para moverlos a la posición deseada. Cada juego de alineadores se usa durante un par de semanas antes de pasar al siguiente.

**Beneficios principales:**
- **Estética:** Son prácticamente invisibles.
- **Comodidad:** Al no tener alambres ni brackets, evitan llagas e irritaciones en la boca.
- **Higiene:** Son removibles, lo que facilita el cepillado y el uso del hilo dental.
- **Sin restricciones:** Puedes comer lo que quieras, ya que debes quitártelos durante las comidas.

Si estás pensando en mejorar tu sonrisa sin comprometer tu imagen durante el proceso, la ortodoncia invisible puede ser la solución perfecta para ti. Visítanos para una evaluación 3D y descubre cómo se verá tu nueva sonrisa antes de empezar el tratamiento.`,
    },
    {
        id: 2,
        title: '5 Consejos para un Blanqueamiento Seguro',
        excerpt: 'No todos los métodos caseros son seguros. Aprende cómo aclarar tus dientes sin dañar el esmalte y evitando la sensibilidad dental.',
        date: 'Sep 25, 2025',
        author: 'Dra. Nazaret Lopez',
        likes: 85,
        readTime: '4 min',
        image: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=400&q=80',
        content: `Tener una sonrisa blanca y brillante es el deseo de muchos, pero es vital hacerlo de forma segura para no comprometer la salud de tus dientes. Aquí te comparto 5 consejos clave:

1. **Acude a un profesional:** Los tratamientos realizados o supervisados por un dentista son los únicos que garantizan resultados seguros y efectivos.
2. **Evita los remedios caseros abrasivos:** El bicarbonato con limón o el carbón activado pueden desgastar tu esmalte de forma irreversible.
3. **Trata la sensibilidad primero:** Si ya sufres de sensibilidad dental, debes tratarla antes de someterte a un blanqueamiento.
4. **Sigue una "Dieta Blanca" post-tratamiento:** Durante las primeras 48 horas, evita alimentos con fuertes colorantes como el café, té, vino tinto, salsa de tomate, etc.
5. **Mantén una buena higiene:** El blanqueamiento no sustituye la limpieza diaria. Cepíllate al menos dos veces al día y usa hilo dental.

Recuerda que el esmalte dental no se regenera. ¡Cuídalo!`,
    },
    {
        id: 3,
        title: 'La Importancia de la Higiene Infantil',
        excerpt: 'Crear hábitos saludables desde pequeños es fundamental. Guía práctica para padres sobre el cuidado de los dientes de leche.',
        date: 'Ago 15, 2025',
        author: 'Dra. Nazaret Lopez',
        likes: 210,
        readTime: '6 min',
        image: 'https://images.unsplash.com/photo-1571772996211-2f02c9727629?auto=format&fit=crop&w=400&q=80',
        content: `Cuidar los dientes de leche es tan importante como cuidar los definitivos. Estos primeros dientes no solo sirven para masticar, sino que guardan el espacio para los dientes permanentes y son esenciales para el desarrollo del habla.

**¿Cuándo empezar a limpiar?**
Antes de que salgan los dientes, puedes limpiar las encías de tu bebé con una gasa húmeda. Una vez que aparezca el primer diente, empieza a usar un cepillo dental de cerdas suaves.

**¿Cuándo usar pasta dental?**
A partir de la erupción del primer diente, se debe usar una cantidad de pasta con flúor del tamaño de un granito de arroz. A partir de los 3 años, la cantidad puede ser del tamaño de un guisante.

**La primera visita al odontopediatra**
Se recomienda que la primera visita al dentista sea durante el primer año de vida o cuando salga el primer diente. Esto ayuda a detectar problemas a tiempo y a que el niño se familiarice con el entorno.

**Consejo para padres:** ¡Haz que el cepillado sea divertido! Usa canciones, juegos o cepillos de sus personajes favoritos. El ejemplo es fundamental; si te ven cepillarte, ellos también querrán hacerlo.`,
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
                <NotifBell />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <ThemedText type="title" style={styles.title}>Blog</ThemedText>
                    <ThemedText style={styles.subtitle}>Noticias, actualizaciones y conocimientos.</ThemedText>
                </View>

                <View style={styles.list}>
                    {posts.map((post) => (
                        <TouchableOpacity key={post.id} style={styles.card} onPress={() => router.push(`/blog/${post.id}` as any)}>
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
        marginBottom: 24,
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
