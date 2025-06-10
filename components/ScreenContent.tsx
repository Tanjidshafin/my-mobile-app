import { Text, View } from 'react-native';
import Navbar from './Navbar';
import Home from './Home';

type ScreenContentProps = {
  path: string;
  children?: React.ReactNode;
};

export const ScreenContent = ({ path, children }: ScreenContentProps) => {
  return (
    <View>
      <View className={styles.separator} />
      {children}
      <Navbar />
      <View className="px-4">
        <Home />
      </View>
    </View>
  );
};
const styles = {
  container: ``,
  separator: ``,
  title: ``,
};
