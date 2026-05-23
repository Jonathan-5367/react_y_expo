import { ThemedText } from '@/components/themed-text';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
}

const { width } = Dimensions.get('window');

export function SideMenu({ visible, onClose }: SideMenuProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const menuItems = [
    { title: 'Inicio', icon: 'home', route: '/dashboard' },
    { title: 'Mi Perfil', icon: 'person', route: '/profile' },
    { title: 'Agendar Cita', icon: 'calendar', route: '/agendar-citas' },
    { title: 'Historial de Citas', icon: 'receipt', route: '/historial-citas' },
    { title: 'Testimonios', icon: 'chatbubbles', route: '/testimonials' },
    { title: 'Blog', icon: 'newspaper', route: '/blog' },
  ];

  const handleNavigation = (route: string) => {
    onClose();
    if (route === '/') {
      router.replace(route);
    } else {
      router.push(route as any);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.overlayBackground} activeOpacity={1} onPress={onClose} />

        <View style={[styles.menuContainer, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons name="medical" size={32} color="#e83e8c" />
            </View>
            <ThemedText style={styles.headerTitle}>Dra. Nazaret Lopez</ThemedText>

            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.menuItems}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => handleNavigation(item.route)}
              >
                <Ionicons name={item.icon as any} size={24} color="#555" style={styles.menuIcon} />
                <ThemedText style={styles.menuText}>{item.title}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.logoutButton} onPress={() => handleNavigation('/')}>
              <Ionicons name="log-out-outline" size={24} color="#F44336" />
              <ThemedText style={styles.logoutText}>Cerrar Sesión</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  overlayBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    width: width * 0.75, // 75% of screen width
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginBottom: 10,
  },
  logoContainer: {
    marginRight: 12,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  menuItems: {
    flex: 1,
    paddingHorizontal: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  menuIcon: {
    marginRight: 16,
    width: 24,
    textAlign: 'center',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  logoutText: {
    fontSize: 16,
    color: '#F44336',
    fontWeight: 'bold',
    marginLeft: 12,
  },
});
