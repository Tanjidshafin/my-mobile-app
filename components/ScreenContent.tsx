import { Text, View } from 'react-native';
import Navbar from './Navbar';

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
    </View>
  );
};
const styles = {
  container: ``,
  separator: ``,
  title: ``,
};
