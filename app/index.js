import App from "./App";
import { PaperProvider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
export default function Index() {
  
  return (

    <PaperProvider>
      <App/>
    </PaperProvider>


  )
}