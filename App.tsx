import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { AppNavigator } from './src/navigation/AppNavigator';
import { colors } from './src/theme/colors';

export default function App() {
  const [fontsLoaded] = useFonts({
    'PlantinMTPro-Regular': require('./assets/fonts/PlantinMTProRg.ttf'),
    'PlantinMTPro-SemiBold': require('./assets/fonts/PlantinMTProSmBd.ttf'),
    'PlantinMTPro-Bold': require('./assets/fonts/PlantinMTProBold.ttf'),
    'Helvetica-Regular': require('./assets/fonts/Helvetica.ttf'),
    'Helvetica-Bold': require('./assets/fonts/Helvetica-Bold.ttf'),
    'Helvetica-Light': require('./assets/fonts/Helvetica-Light.ttf')
  });

  if (!fontsLoaded) {
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
