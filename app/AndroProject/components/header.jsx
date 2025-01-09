import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function Header() {
  return (
    <SafeAreaView>
      <View style={styles.header}>
        <Text style={styles.headerText}>COOLBOOK</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 10,
  },

  headerText: {
    color: '#4267B2',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
