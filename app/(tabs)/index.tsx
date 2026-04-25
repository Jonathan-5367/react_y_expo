import { ThemedText } from '@/components/themed-text';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react'; // Added import
import { ScrollView, StyleSheet, TouchableOpacity, View, useWindowDimensions } from 'react-native'; // Added useWindowDimensions
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [menuOpen, setMenuOpen] = useState(false);

  const isMobile = width < 768; // Pantallas menores a 768px (tablets/mobile)

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleNavPress = (path: string) => {
    setMenuOpen(false);
    if (path) router.push(path as any);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Navbar / Header Area */}
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          {isMobile ? (
            <View style={styles.mobileHeaderContainer}>
              <View style={styles.mobileTopBar}>
                <ThemedText style={styles.mobileBrand}>Dra. Nazaret</ThemedText>
                <TouchableOpacity onPress={toggleMenu} style={styles.hamburgerBtn}>
                  <Ionicons name={menuOpen ? "close" : "menu"} size={32} color="#333" />
                </TouchableOpacity>
              </View>

              {menuOpen && (
                <View style={styles.mobileNavMenu}>
                  <TouchableOpacity style={styles.mobileNavItem} onPress={() => handleNavPress('/register')}><ThemedText style={styles.mobileNavText}>Registro</ThemedText></TouchableOpacity>
                  <TouchableOpacity style={styles.mobileNavItem} onPress={() => handleNavPress('/login')}><ThemedText style={styles.mobileNavText}>Iniciar Sesión</ThemedText></TouchableOpacity>
                  <TouchableOpacity style={styles.mobileNavItem} onPress={() => handleNavPress('/testimonials')}><ThemedText style={styles.mobileNavText}>Testimonios</ThemedText></TouchableOpacity>
                  <TouchableOpacity style={styles.mobileNavItem} onPress={() => handleNavPress('/blog')}><ThemedText style={styles.mobileNavText}>Blog</ThemedText></TouchableOpacity>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.navRow}>
              <TouchableOpacity onPress={() => { }}><ThemedText style={styles.navItem}>Inicio</ThemedText></TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/register')}><ThemedText style={styles.navItem}>Registro</ThemedText></TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/login')}><ThemedText style={styles.navItem}>Iniciar Sesión</ThemedText></TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/testimonials')}><ThemedText style={styles.navItem}>Testimonios</ThemedText></TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/blog')}><ThemedText style={styles.navItem}>Blog</ThemedText></TouchableOpacity>
            </View>
          )}
        </View>

        {/* Banner de horario */}
        <View style={styles.banner}>
          <ThemedText style={styles.bannerText}>📅 Horario de atención: <ThemedText type="defaultSemiBold" style={styles.bannerTextBold}>Lunes a Jueves de 9:00 AM a 12:30 PM</ThemedText></ThemedText>
        </View>

        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.heroOverlay}>
            <ThemedText style={styles.heroLabel}>Consultorio Odontológico</ThemedText>
            <ThemedText type="title" style={styles.heroTitle}>DRA. NAZARET LOPEZ</ThemedText>
            <ThemedText style={styles.heroSubtitle}>Odontóloga especialista en Ortodoncia con más de 10 años de experiencia.</ThemedText>

            <TouchableOpacity style={styles.heroButton} onPress={() => router.push('/login')}>
              <ThemedText style={styles.heroButtonText}>Agendar Cita</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sobre Dra Section */}
        <View style={styles.sectionAlt}>
          <View style={styles.aboutContainer}>
            <Image
              source={{ uri: 'https://placehold.co/500x600/e83e8c/white?text=Dra.+Nazaret+López' }}
              style={styles.aboutImage}
              contentFit="cover"
            />
            <View style={styles.aboutContent}>
              <ThemedText type="subtitle" style={styles.sectionTitlePink}>Sobre la Dra. Nazaret López</ThemedText>
              <ThemedText style={styles.paragraph}>
                La Dra. Nazaret López es una odontóloga especializada en ortodoncia con más de 10 años de experiencia ayudando a pacientes a lograr sonrisas saludables y hermosas.
              </ThemedText>
              <ThemedText style={styles.paragraph}>
                Graduada con honores de la Universidad Nacional Autónoma de México, la Dra. López se mantiene actualizada con las últimas técnicas y tecnologías en ortodoncia y cuidado dental.
              </ThemedText>
              <ThemedText style={styles.paragraph}>
                Su enfoque centrado en el paciente y su atención meticulosa a los detalles hacen que cada tratamiento sea personalizado para alcanzar los mejores resultados posibles.
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Especialidades Section */}
        <View style={styles.section}>
          <ThemedText type="title" style={styles.sectionTitleCenter}>Mis Especialidades</ThemedText>
          <View style={styles.grid}>
            <SpecialtyCard title="Ortodoncia" desc="Certificada por la Asociación Mexicana de Ortodoncia." icon="medkit" />
            <SpecialtyCard title="Blanqueamiento" desc="Técnicas avanzadas sin sensibilidad." icon="sparkles" />
            <SpecialtyCard title="Implantes" desc="Recupera tu sonrisa con materiales de calidad." icon="construct" />
            <SpecialtyCard title="Estética" desc="Mejora la apariencia de tu sonrisa." icon="flower" />
          </View>
        </View>

        {/* Servicios Section */}
        <View style={styles.sectionAlt}>
          <ThemedText type="title" style={styles.sectionTitleCenter}>Servicios Odontológicos</ThemedText>
          <View style={styles.grid}>
            <SpecialtyCard title="Ortodoncia Invisible" desc="Tecnología Invisalign® para adultos" icon="happy" />
            <SpecialtyCard title="Implantes Dentales" desc="Recupera tu sonrisa con materiales de calidad" icon="construct" />
            <SpecialtyCard title="Limpieza Dental" desc="Mantenimiento preventivo para una sonrisa saludable" icon="water" />
            <SpecialtyCard title="Carillas Estéticas" desc="Mejora la forma y color de tus dientes" icon="brush" />
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>📞 Teléfono: +52 55 1234 5678</ThemedText>
          <ThemedText style={styles.footerText}>✉️ Email: contacto@draodontologa.com</ThemedText>
          <ThemedText style={styles.footerText}>📍 Dirección: Av. Principal #123, Ciudad de México</ThemedText>
        </View>

      </ScrollView>
    </View>
  );
}

function SpecialtyCard({ title, desc, icon }: { title: string, desc: string, icon: any }) {
  return (
    <View style={styles.card}>
      <Ionicons name={icon} size={32} color="#e83e8c" style={styles.cardIcon} />
      <ThemedText style={styles.cardTitle}>{title}</ThemedText>
      <ThemedText style={styles.cardDesc}>{desc}</ThemedText>
    </View>
  );
}



const styles = StyleSheet.create({
  // --- Main Layout ---
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // --- Header / Navigation ---
  header: {
    backgroundColor: '#fff',
    paddingBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  navRow: {
    flexDirection: 'row',
    gap: 30,
    marginTop: 20,
  },
  navItem: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  // Mobile Menu Styles
  mobileHeaderContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  mobileTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingBottom: 10,
  },
  mobileBrand: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e83e8c',
  },
  hamburgerBtn: {
    padding: 5,
  },
  mobileNavMenu: {
    width: '100%',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 0,
  },
  mobileNavItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
    width: '100%',
    alignItems: 'center',
  },
  mobileNavText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },

  // --- Banner Section ---
  banner: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  bannerText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#495057',
  },
  bannerTextBold: {
    color: '#212529',
  },

  // --- Hero Section ---
  hero: {
    backgroundColor: '#e83e8c', // Pink hero background
    paddingVertical: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroOverlay: {
    alignItems: 'center',
  },
  heroLabel: {
    color: 'rgba(255,255,255,0.9)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 14,
    marginBottom: 10,
    fontWeight: '600',
  },
  heroTitle: {
    color: '#fff',
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '800',
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    textAlign: 'center',
    maxWidth: 300,
    marginBottom: 30,
    lineHeight: 24,
  },
  heroButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  heroButtonText: {
    color: '#e83e8c',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },

  // --- Content Sections ---
  section: {
    padding: 24,
    backgroundColor: '#fff',
  },
  sectionAlt: {
    padding: 24,
    backgroundColor: '#FFF0F6', // Very light pink
  },
  sectionTitleCenter: {
    textAlign: 'center',
    fontSize: 28,
    marginBottom: 24,
    color: '#333',
  },
  sectionTitlePink: {
    color: '#e83e8c',
    fontSize: 24,
    marginBottom: 16,
  },
  aboutContainer: {
    gap: 20,
    alignItems: 'center',
  },
  aboutImage: {
    width: '90%',
    height: 450,
    borderRadius: 12,
  },
  aboutContent: {
    gap: 12,
    alignItems: 'center',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
    textAlign: 'justify',
  },

  // --- Cards & Grid ---
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  card: {
    width: '45%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardIcon: {
    marginBottom: 12,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
    color: '#333',
  },
  cardDesc: {
    fontSize: 12,
    textAlign: 'center',
    color: '#666',
  },

  // --- Footer Section ---
  footer: {
    backgroundColor: '#343a40',
    padding: 30,
    alignItems: 'center',
    gap: 10,
  },
  footerText: {
    color: '#f8f9fa',
    fontSize: 14,
  },
});
