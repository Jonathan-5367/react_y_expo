import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import 'react-native-reanimated';
import * as Notifications from 'expo-notifications';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { initAuth } from '@/store/auth';

// Configure how notifications are handled when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const unstable_settings = {
  anchor: 'login',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    // Al iniciar la app, verificamos si hay una sesión guardada.
    // El Stack ya está montado en este punto, por lo que el router funciona correctamente.
    initAuth().then((user) => {
      if (user) {
        // Si hay sesión activa, redirigir directamente al dashboard
        router.replace('/dashboard');
      }
      // Ocultar el spinner DESPUÉS de haber lanzado la redirección (o no)
      setIsAuthReady(true);
    });
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="dashboard" options={{ headerShown: false }} />
        <Stack.Screen name="registro-admin" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />

      {/* Spinner superpuesto: visible solo mientras se verifica la sesión guardada */}
      {!isAuthReady && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#e83e8c" />
        </View>
      )}
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFF0F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
