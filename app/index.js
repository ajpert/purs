import { PaperProvider, Text } from "react-native-paper";
import App from "./App";
import ChoiceScreen from "./ChoiceScreen";
import { AuthProvider } from "../context/AuthContext";
import CompleteScreen from "../app/Complete-order/index";



export default function Index() {
  return (
    <PaperProvider>
      <App />
    </PaperProvider>
  );
}
