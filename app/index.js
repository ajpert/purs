import { PaperProvider } from "react-native-paper";
import App from "./App";
export default function Index() {
  return (
    <PaperProvider>
      <App />
    </PaperProvider>
  );
}
