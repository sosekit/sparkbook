import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { DEMO_MODE } from './src/config/demoMode';
import { AppNavigator } from './src/navigation/AppNavigator';
import { ensureDemoData } from './src/services/demoDataService';
import { colors } from './src/theme/colors';

export default function App() {
  const [demoReady, setDemoReady] = useState(!DEMO_MODE);
  const [fontsLoaded] = useFonts({
    'PlantinMTPro-Regular': require('./assets/fonts/PlantinMTProRg.ttf'),
    'PlantinMTPro-SemiBold': require('./assets/fonts/PlantinMTProSmBd.ttf'),
    'PlantinMTPro-Bold': require('./assets/fonts/PlantinMTProBold.ttf'),
    'Helvetica-Regular': require('./assets/fonts/Helvetica.ttf'),
    'Helvetica-Bold': require('./assets/fonts/Helvetica-Bold.ttf'),
    'Helvetica-Light': require('./assets/fonts/Helvetica-Light.ttf')
  });

  useEffect(() => {
    let mounted = true;
    if (!DEMO_MODE) return;
    ensureDemoData().finally(() => {
      if (mounted) setDemoReady(true);
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (!fontsLoaded || !demoReady) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <AppNavigator />
    </>
  );
}
