import { router } from "expo-router";
import React, { useContext, useState } from "react";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native";
import { IconButton, TextInput } from "react-native-paper";
import { cn } from "../lib/utils";

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

import { RoleContext } from "../context/RoleContext";

const ChoiceScreen = () => {
  const { setRole } = useContext(RoleContext);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSubmit = () => {
    // Handle phone number submission logic here
    console.log("Phone Number:", phoneNumber);
  };

  const handleRoleSelection = (role) => {
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
    <View className="flex flex-col items-center justify-center h-1/2 my-auto">
      <View className="self-stretch ml-8 mr-8 mt-6">
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
                "bg-green-400": item.role === "Customer",
                "bg-blue-400": item.role === "Bank",
              }
            )}
            onPress={() => handleRoleSelection(item.role)}
          >
            <Image
              source={item.icon}
              className="w-12 h-12 ml-4 mr-2 flex-1 lg:hidden" //holy hack "flex-1"
            />
            <View className="flex flex-col ml-2 w-4/6 lg:mx-auto">
              <Text className="text-2xl lg:text-center font-medium">
                {item.role}
              </Text>
              <Text className="text-sm font-light lg:text-center">
                {item.description}
              </Text>
            </View>
            <View className="flex-1 flex flex-row w-min lg:hidden">
              <Image
                source={logos.Arrow}
                className="w-10 h-10 flex-grow-0 lg:flex-1"
              />
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <BankConnectionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
      <Text className="text-white text-2xl text-center mt-8">
        This helps us give you the best experience on Polaris.
      </Text>
    </View>
  );
};

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

export default ChoiceScreen;
