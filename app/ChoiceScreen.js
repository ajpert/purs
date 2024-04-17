import { router } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { cn } from "../lib/utils.js";
import { supabase } from "../lib/supabase";
import { RoleContext } from "../context/RoleContext";

const data = [
  {
    role: "Merchant",
    description: "You're the one selling the goods",
    icon: require("../assets/merchant-1.png"),
  },
  {
    role: "Customer",
    description: "You're the one buying the goods",
    icon: require("../assets/customer.png"),
  },
  {
    role: "Bank",
    description: "You're the one managing the money",
    icon: require("../assets/bank.png"),
  },
];

const logos = {
  Merchant: require("../assets/merchant-1.png"),
  Customer: require("../assets/customer.png"),
  Bank: require("../assets/bank.png"),
  Edit: require("../assets/edit.png"),
  Arrow: require("../assets/arrow-1.png"),
};

const ChoiceScreen = () => {
  const { setRole } = useContext(RoleContext);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [connected, setConnected] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id);

      setUserData(data[0]);
      setUser(user);
    }
    fetchUser();
  }, []);

  const handleLogOut = async () => {
    await supabase.auth.signOut();
    router.replace("/"); // Redirect to the home screen or login screen
  };

  handleRoleSelection = (role) => {
    setRole(role);
    console.log(role);
    if (role == "Customer") {
      router.push("/scan");
    } else if (role == "Bank") {
      setModalVisible(true);
    } else if (role == "Merchant") {
      router.push("/event-manager");
    }
  };

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  return (
    <><TouchableOpacity
      style={{ position: 'absolute', top: 40, right: 20, backgroundColor: 'red', padding: 10, borderRadius: 10 }}
      onPress={handleLogOut}
    >
      <Text className="text-white text-xl">Log Out</Text>
    </TouchableOpacity><View className="flex flex-col items-center justify-center h-1/2 my-auto">

        <View className="flex flex-row justify-between self-stretch ml-8 mr-8 mt-6">
          <Text className="text-white text-4xl text-left mx-auto">
            Which best fits you?
          </Text>

        </View>

        <View className="flex flex-col items-center mt-8">
          {data.map((item) => (
            <TouchableOpacity
              key={item.role}
              className={cn(
                `flex flex-row justify-between items-center mb-4 w-96 h-24 rounded-3xl`,
                {
                  "bg-orange-400": item.role === "Merchant",
                  "bg-blue-400": item.role === "Customer",
                  "bg-white": !userData.connected && item.role === "Bank", // If bank is not connected, set background to white
                  "bg-green-400": userData.connected && item.role === "Bank", // If bank is connected, set background to green
                }
              )}
              onPress={() => handleRoleSelection(item.role)}
            >
              <Image
                source={item.icon}
                className="w-12 h-12 ml-4 mr-2 flex-1 lg:hidden" />
              <View className="flex flex-col ml-2 w-4/6 lg:mx-auto">
                <Text className="text-2xl lg:text-center font-medium">
                  {item.role === "Bank"
                    ? userData.connected
                      ? "Bank Connected"
                      : "Connect to Bank"
                    : item.role}
                </Text>
                <Text className="text-sm font-light lg:text-center">
                  {item.description}
                </Text>
              </View>
              <View className="flex-1 flex flex-row w-min lg:hidden">
                <Image
                  source={logos.Arrow}
                  className="w-10 h-10 flex-grow-0 lg:flex-1" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <BankConnectionModal
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false);
            setConnected(true);
          }}
          setUserData={setUserData}
        />
        <Text className="text-white text-2xl text-center mt-8">
          This helps us give you the best experience on Polaris.
        </Text>
      </View></>
  );
};
/*

const BankConnectionModal = ({ visible, onClose }) => {
  const [accountNumber, setAccountNumber] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center">
        <View className="flex flex-col gap-2 bg-white p-8 rounded-lg">
          <Text className="text-lg">
            Connect your banking account to Polaris
          </Text>
          <TextInput
            onChangeText={setAccountNumber}
            value={accountNumber}
            placeholder="Account Number"
          />
          <TextInput
            onChangeText={setRoutingNumber}
            value={routingNumber}
            placeholder="Routing Number"
          />
          <TextInput
            onChangeText={setAccountHolderName}
            value={accountHolderName}
            placeholder="Account Holder Name"
          />
          <View className="flex flex-row justify-between">
            <View className="flex flex-row items-center">
              <IconButton icon="check" mode="outlined" onPress={onClose} />
              <Text>Connect</Text>
            </View>
            <View className="flex flex-row items-center">
              <IconButton icon="close" mode="outlined" onPress={onClose} />
                          <Text>Cancel</Text>
                      </View>
                  </View>
              </View>
          </View>
      </Modal>
  );
};

*/

/*
const ChoiceScreen = () => {
  const [user, setUser] = useState(null);
  const { setRole } = useContext(RoleContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id);

      setUserData(data[0]);
      setUser(user);
    }
    fetchUser();
  }, []);
  console.log("USER", user, userData);

  handleRoleSelection = (role) => {
    setRole(role);
    console.log(role);
    if (role == "Customer") {
      router.push("/scan");
    } else if (role == "Bank") {
      setModalVisible(true);
    } else if (role == "Merchant") {
      router.push("/event-manager");
    }
  };
  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text style={styles.text}>Let's Figure You Out 👋</Text>
          <View style={styles.textContainer}>
            <Text style={styles.normalText}>
              Are you a customer or a Merchant?
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                styles.buttonBank,
                {
                  backgroundColor:
                    userData.connected || connected ? "lightgreen" : "white",
                },
              ]}
              onPress={() => handleRoleSelection("Bank")}
            >
              <Image
                style={styles.buttonLogo}
                source={require("../assets/bank.png")}
              />
              <Text style={styles.buttonText}>
                {userData.connected || connected
                  ? "Bank Connected"
                  : "Connect to Bank"}
              </Text>
              <Image
                style={styles.buttonEdit}
                source={require("../assets/edit.png")}
              />
              <BankConnectionModal
                visible={modalVisible}
                onClose={() => {
                  setModalVisible(false);
                  setConnected(true);
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonCustomer]}
              onPress={() => handleRoleSelection("Customer")}
            >
              <Image
                style={styles.buttonLogo}
                source={require("../assets/customer.png")}
              />
              <Text style={styles.buttonText}>Customer</Text>

              <Image
                style={styles.buttonArrow}
                source={require("../assets/arrow-1.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonMerchant]}
              onPress={() => handleRoleSelection("Merchant")}
            >
              <Image
                style={styles.buttonLogo}
                source={require("../assets/merchant-1.png")}
              />
              <Text style={styles.buttonText}>Merchant</Text>
              <Image
                style={styles.buttonArrow}
                source={require("../assets/arrow-1.png")}
              />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <></>
      )}
    </View>
  );
};
*/

const BankConnectionModal = ({ visible, onClose, setUserData }) => {
  const setBank = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("user_profiles")
      .update({ connected: true })
      .eq("id", user.id)
      .select();

    if (error) {
      console.error("Error updating user profile:", error);
    } else {
      const updatedUserData = data[0];
      onClose();
      setUserData(updatedUserData);
    }
  };

  const [accountNumber, setAccountNumber] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={setBank}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TextInput
            style={styles.input}
            onChangeText={setAccountNumber}
            value={accountNumber}
            placeholder="Account Number"
            placeholderTextColor={"grey"}
          />
          <TextInput
            style={styles.input}
            onChangeText={setRoutingNumber}
            value={routingNumber}
            placeholder="Routing Number"
            placeholderTextColor={"grey"}
          />
          <TextInput
            style={styles.input}
            onChangeText={setAccountHolderName}
            value={accountHolderName}
            placeholder="Account Holder Name"
            placeholderTextColor={"grey"}
          />
          <Button title="Submit" onPress={setBank} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start", // Align children to the top
    alignItems: "center",
    backgroundColor: "black",
  },
  text: {
    marginTop: 100,
    fontSize: 35,
    color: "#fff", // White text color
  },
  textContainer: {
    alignSelf: "stretch",
    marginLeft: 30,
    marginRight: 20,
    marginTop: 20,
  },
  normalText: {
    fontSize: 18,
    color: "#fff",
    textAlign: "left",
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: "column",

    marginTop: 50,
    width: "100%",
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    alignItems: "center",
    borderRadius: 40,
    marginLeft: 40,
    width: "80%",
    height: 100,
  },
  buttonCustomer: {
    backgroundColor: "#FFC94A",
  },
  buttonMerchant: {
    backgroundColor: "#5BBCFF",
  },
  buttonBank: {
    backgroundColor: "#fff",
  },
  buttonText: {
    fontSize: 25,
    color: "#fff",
    textAlign: "center",
    color: "black",
  },
  buttonLogo: {
    width: 40,
    height: 40,
    marginLeft: 30,
    marginRight: 10,
  },
  buttonArrow: {
    width: 40,
    height: 40,
    marginLeft: 10,
  },
  buttonEdit: {
    width: 40,
    height: 40,
    marginLeft: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 200,
    color: "black",
  },
});

export default ChoiceScreen;
