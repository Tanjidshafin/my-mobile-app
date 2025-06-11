import { ScrollView, View } from 'react-native';
import Navbar from './Navbar';
import Home from './Home';
import Footer from './Footer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './LoginScreen';
import SignupScreen from './SignupScreen';
import ProductDetails from './ProductDetails';
import { useUser } from 'context/UserContext';

type ScreenContentProps = {
  path?: string;
  children?: React.ReactNode;
};

const Stack = createNativeStackNavigator();

// Main content component with navbar and footer
const MainContent = ({ children }: { children?: React.ReactNode }) => (
  <ScrollView>
    <View className={styles.separator} />
    <Navbar />
    <View className="flex-1">{children || <Home />}</View>
    <Footer />
  </ScrollView>
);

export const ScreenContent = ({ path, children }: ScreenContentProps) => {
  const { user } = useUser();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" options={{ headerShown: false }}>
          {() => <MainContent>{children}</MainContent>}
        </Stack.Screen>
        {!user && (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
          </>
        )}
        <Stack.Screen
          name="ProductDetails"
          component={ProductDetails}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = {
  container: ``,
  separator: ``,
  title: ``,
};
