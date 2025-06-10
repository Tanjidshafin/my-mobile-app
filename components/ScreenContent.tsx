import { Text, View } from 'react-native';
import Navbar from './Navbar';
import Home from './Home';
import Footer from './Footer';

type ScreenContentProps = {
  path: string;
  children?: React.ReactNode;
};

export const ScreenContent = ({ path, children }: ScreenContentProps) => {
  
  return (
    <View className="flex-1">
      <View className={styles.separator} />
      <Navbar />
      <View className="flex-1">{children || <Home />}</View>
      <Footer />
    </View>
  );
};

const styles = {
  container: ``,
  separator: ``,
  title: ``,
};
