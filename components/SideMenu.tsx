import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/store/auth';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
}

const { width } = Dimensions.get('window');

export function SideMenu({ visible, onClose }: SideMenuProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();

  const menuItems = [
    { title: 'Inicio', icon: 'home', route: '/dashboard' },
    { title: 'Mi Perfil', icon: 'person', route: '/profile' },
    ...(user?.rol === 'administrador' || user?.rol === 'doctor' ? [
      { title: 'Lista de Pacientes', icon: 'people', route: '/lista-pacientes' },
      { title: 'Registrar Admin', icon: 'person-add', route: '/registro-admin' }
    ] : []),
    { title: 'Agendar Cita', icon: 'calendar', route: '/agendar-citas' },
    { title: 'Calendario de Citas', icon: 'calendar', route: '/calendario-citas' },
    { title: 'Historial de Citas', icon: 'receipt', route: '/historial-citas' },
    { title: 'Testimonios', icon: 'chatbubbles', route: '/testimonials' },
    { title: 'Blog', icon: 'newspaper', route: '/blog' },
  ];

  const handleNavigation = (route: string) => {
    onClose();
    if (route === '/login') {
      logout();
      router.replace(route as any);
    } else if (route === '/') {
      router.replace(route as any);
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
              <Image
                source={require('@/assets/images/logo doctora - rosa pequeño.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            <View style={styles.userInfo}>
              <ThemedText style={styles.headerTitle} numberOfLines={2}>{user?.nombre || "Dra. Nazaret Lopez"}</ThemedText>
              <View style={[styles.roleBadge, {
                backgroundColor:
                  user?.rol === 'administrador' ? '#e83e8c' :
                    user?.rol === 'doctor' ? '#2E8B57' :
                      user?.rol === 'recepcionista' ? '#FD7E14' : '#4A90E2'
              }]}>
                <ThemedText style={styles.roleText}>
                  {user?.rol ? (user.rol.charAt(0).toUpperCase() + user.rol.slice(1)) : 'Paciente'}
                </ThemedText>
              </View>
            </View>

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
            <TouchableOpacity style={styles.logoutButton} onPress={() => handleNavigation('/login')}>
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
  logoImage: {
    width: 45,
    height: 45,
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 20,
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
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  roleText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
});
