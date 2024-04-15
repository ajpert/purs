import { PaperProvider } from "react-native-paper";
import App from "./App";
import ChoiceScreen from "./ChoiceScreen";
export default function Index() {
  return (
    <PaperProvider>
      <ChoiceScreen />
    </PaperProvider>
  );
}
