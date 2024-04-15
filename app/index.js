import { PaperProvider, Text } from "react-native-paper";
import App from "./App";
import ChoiceScreen from "./ChoiceScreen";
import { AuthProvider } from "../context/AuthContext";


export default function Index() {
  return (
    <PaperProvider>


        <App />


    </PaperProvider>

  );
}
