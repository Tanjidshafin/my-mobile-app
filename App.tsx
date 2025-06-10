import { ScreenContent } from 'components/ScreenContent';
import { StatusBar } from 'expo-status-bar';
import './global.css';
import { UserProvider } from 'context/UserContext';

export default function App() {
  return (
    <>
      <UserProvider>
        <ScreenContent title="Home" path="App.tsx"></ScreenContent>
        <StatusBar style="auto" />
      </UserProvider>
    </>
  );
}
