import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect, useNavigation, useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import {
	Appbar,
	Button,
	Card,
	Modal,
	Paragraph,
	Portal,
	Switch,
	Title,
} from "react-native-paper";

/*
import React, { useState, useEffect, useContext } from "react";
import { ScrollView, View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Header } from "react-native-elements";
import { Button, Card, Paragraph, Title, Appbar, Portal, Modal, Switch, TextInput } from "react-native-paper";
*/

import { useLocalSearchParams } from "expo-router";
import { supabase } from "../../../lib/supabase";

import { RoleContext } from "../../../context/RoleContext";

function HeaderComponent(props) {
	const navigation = useNavigation();
	const router = useRouter();
	const [isNavigationReady, setIsNavigationReady] = useState(false);

	useEffect(() => {
		const unsubscribe = navigation.addListener("state", () => {
			setIsNavigationReady(true);
		});

		return unsubscribe;
	}, [navigation]);

	return (
		<Appbar.Header
			statusBarHeight={30}
			style={{ backgroundColor: "black" }}
		>
			{isNavigationReady && (
				<Appbar.BackAction
					onPress={() => {
						router.back();
					}}
					color={"white"}
				/>
			)}

			<Appbar.Content
				title="Store Front"
				titleStyle={{ color: "white", fontSize: 20 }}
			/>
			<Appbar.Action
				icon="cog"
				color={"white"}
				onPress={() => {
					props.showModal();
				}}
			/>
		</Appbar.Header>
	);
}

const randomUUID = () => {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0;
		const v = c === "x" ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
};

const mockData = [
	{
		id: randomUUID(),
		name: "Bacon and Eggs",
		description: "The best bacon in town.",
		imageUrl: "http://placebacon.net/400/300?image=1",
		cost: 10,
	},
	{
		id: randomUUID(),
		name: "Bacon the Sequel",
		description: "The second best bacon in town",
		imageUrl: "http://placebacon.net/400/300?image=2",
		cost: 15,
	},
	{
		id: randomUUID(),
		name: "Bacon the Threequel",
		description: "Just some bacon.",
		imageUrl: "http://placebacon.net/400/300?image=3",
		cost: 8,
	},
	{
		id: randomUUID(),
		name: "Bacon the Fourthquel",
		description: "BACON BABY!",
		imageUrl: "http://placebacon.net/400/300?image=4",
		cost: 20,
	},
	{
		id: randomUUID(),
		name: "Bacon quatro cinco",
		description: "Who don't love bacon?",
		imageUrl: "http://placebacon.net/400/300?image=5",
		cost: 10,
	},
];
const MoneyCard = ({ handleAddToCart }) => {

	const [memo, setMemo] = useState('');
  
	const [amount, setAmount] = useState('');

	const handleAmountChange = (text) => {
	  setAmount(text);
	};
  
	const handleMemoChange = (text) => {
	  setMemo(text);
	};
  
	const handleAddMoney = () => {
		const numericAmount = parseFloat(amount);
	  
		if (!isNaN(numericAmount) && numericAmount > 0) {
		  const item = {
			id: randomUUID(),
			name: `Sending`,
			description: `Note: ${memo}`,
			cost: numericAmount,
		  };
	  
		  handleAddToCart(item);
		  setAmount('');
		  setMemo('');
		}
	  };
  
	return (
	  <Card
		key="money"
		style={{
		  margin: 5,
		  padding: 10,
		  borderRadius: 10,
		  backgroundColor: '#262626',
		  position: 'relative',
		}}
	  >
		<Card.Content
		  style={{
			position: 'absolute',
			zIndex: 1,
			backgroundColor: 'rgba(0,0,0,0.5)',
			borderRadius: 10,
			padding: 10,
			width: '100%',
		  }}
		>
		  <Title style={{ color: '#fff' }}>Send Money</Title>
		  <Paragraph style={{ color: '#fff' }}>
			Enter an amount and an optional memo
		  </Paragraph>
		</Card.Content>
		<Card.Cover  style={{ objectFit: 'cover', height: 100, backgroundColor: 'green' }} />
		<TextInput
		  style={styles.input}
		  placeholder="Enter amount"
		  keyboardType="numeric"
		  value={amount.toString()}
		  onChangeText={handleAmountChange}
		/>
		<TextInput
		  style={styles.input}
		  placeholder="Enter memo (optional)"
		  value={memo}
		  onChangeText={handleMemoChange}
		/>
		<Button
		  mode="contained"
		  style={{
			margin: 10,
			borderRadius: 10,
			backgroundColor: '#3f3f46',
		  }}
		  onPress={handleAddMoney}
		>
		  Add Money
		</Button>
	  </Card>
	);
  };

export default function CustomerStoreFront() {
	const { role } = useContext(RoleContext);
	console.log("ROLE", role);
	const { qr_reference } = useLocalSearchParams();

	const [session, setSession] = useState(null);

	const [data, setData] = useState(null);

	const [cart, setCart] = useState([]);

	const [visible, setVisible] = useState(false);

	const hideModal = () => setVisible(false);
	const showModal = () => setVisible(true);

	const [isSwitchOn, setIsSwitchOn] = React.useState(false);
  
	const onToggleSwitch = async () => { 
		await fetchData(); 
		setIsSwitchOn(!isSwitchOn)
	}

	//const temp = useSupabaseChannel("test2", qr_reference)

	//console.log("TEMP", temp.length)
	const fetchData = async () => {
		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			const { data: getTest, error: errorTest } = await supabase
				.from("test2")
				.select("testData")
				.eq("qr_id", qr_reference)
				.single();

			if (errorTest) {
				console.error("Error fetching initial testData3:", errorTest);
			} else {
				if (!isSwitchOn) {
					console.log("SWITCH ON");
					const arr = getTest.testData.filter(
						(item) => item.owner === user.id
					);
					setCart(arr);
				} else {
					setCart(getTest.testData);
				}
			}
		} catch (error) {
			console.error("Error fetching initial data4:", error);
		}
	};
	console.log("IS THE SWITCH ON", isSwitchOn);
	useFocusEffect(
		React.useCallback(() => {
			const fetchInitialData = async () => {
				try {
					const {
						data: { user },
					} = await supabase.auth.getUser();
					const {
						data: getTest,
						error: errorTest,
					} = await supabase
						.from("test2")
						.select("testData")
						.eq("qr_id", qr_reference)
						.single();

					if (errorTest) {
						console.error(
							"Error fetching initial testData3:",
							errorTest
						);
					} else {
						if (isSwitchOn) {
							const arr = getTest.testData.filter(
								(item) => item.owner === user.id
							);
							setCart(arr);
						} else {
							setCart(getTest.testData);
						}
					}
				} catch (error) {
					console.error("Error fetching initial data4:", error);
				}
			};

			fetchInitialData();
			const channel = supabase
				.channel("table-filter-changes")
				.on(
					"postgres_changes",
					{
						event: "*",
						schema: "public",
						table: "test2",
						filter: `qr_id=eq.${qr_reference}`,
					},
					(payload) => {
						if (isSwitchOn) {
							console.log("STORE FRONT SWITCH ON");
							const arr = payload.new.testData.filter(
								(item) => item.owner === user.id
							);
							setCart(arr);
						} else {
							console.log("STORE FRONT SWITCH OFF");
							setCart(payload.new.testData);
						}
					}
				)
				.subscribe();

			return () => {
				channel.unsubscribe();
			};
		}, [])
	);

	const handlePress = async () => {
		await AsyncStorage.setItem("cart", JSON.stringify(cart));
		router.push({
			pathname: "/cart/customer",
			params: { qr_reference: qr_reference, ownItems: isSwitchOn },
		});
	};

	const handleAddToCart = async (item) => {
		const {
			data: { user },
		} = await supabase.auth.getUser();
		try {
			// Fetch the existing testData from the database
			const { data: getTest, error: errorTest } = await supabase
				.from("test2")
				.select("testData")
				.eq("qr_id", qr_reference)
				.single();

			if (errorTest) {
				console.error("Error fetching testData5:", errorTest);
				return;
			}

			// Create a new item to be added
			const newItem = {
				id: randomUUID(),
				name: `${item.name} - $${item.cost}`,
				description: `${item.description}`,
				imageUrl: `${item.imageUrl}`,
				cost: item.cost,
			};


			if (role === "Customer") {
				newItem.owner = user.id;
			}
			else {
				console.log("ADDING FROM MERCHANT")
				newItem.owner = ""
			

			// Combine the existing testData with the new item
			const newData = [...getTest.testData, newItem];

			// Update the testData in the database
			const { data, error } = await supabase
				.from("test2")
				.update({ testData: newData })
				.eq("qr_id", qr_reference)
				.select();

			if (error) {
				console.error("Error updating testData:", error);
				return;
			}

			// Update the local cart state
		} catch (error) {
			console.error("Error handling AddToCart:", error);
		}
	};

	return (
		<View style={{ flex: 1, backgroundColor: "#171717" }}>
			<HeaderComponent showModal={showModal} />
			<Portal>
				<Modal
					visible={visible}
					onDismiss={hideModal}
					contentContainerStyle={styles.modal}
					presentationStyle="overFullScreen"
				>
					<View>
						<View style={styles.modalHeader}>
							<Text style={styles.modalTitle}>Settings</Text>
						</View>

						<View style={styles.modalBody}>
							<View
								style={{
									flexDirection: "row",
									justifyContent: "space-between",
									alignItems: "center",
								}}
							>
								<Text style={{ fontWeight: "bold" }}>
									Only See My Items
								</Text>
								<Switch
									value={isSwitchOn}
									onValueChange={onToggleSwitch}
								/>
							</View>
						</View>
					</View>

					<View style={styles.modalFooter}>
						<TouchableOpacity
							onPress={hideModal}
							style={[styles.button, styles.createButton]}
						>
							<Text style={styles.buttonText}>Close</Text>
						</TouchableOpacity>
					</View>
				</Modal>
			</Portal>
			<ScrollView style={{ padding: 10 }}>
			<MoneyCard handleAddToCart={handleAddToCart} />
				{mockData.map((item) => (
					<Card
						key={item.id}
						style={{
							margin: 5,
							padding: 10,
							borderRadius: 10,
							backgroundColor: "#262626",
							position: "relative",
						}}
					>
						<Card.Content
							style={{
								position: "absolute",
								zIndex: 1,
								backgroundColor: "rgba(0,0,0,0.5)",
								borderRadius: 10,
								padding: 10,
								width: "100%",
							}}
						>
							<Title style={{ color: "#fff" }}>{item.name} - {item.cost}$</Title>
							<Paragraph style={{ color: "#fff" }}>
								{item.description}
							</Paragraph>
						</Card.Content>
						<Card.Cover
							source={{ uri: item.imageUrl }}
							style={{ objectFit: "cover", height: 100 }}
						/>
						<Button
							mode="outlined"
							style={{
								margin: 10,
								borderRadius: 10,
								backgroundColor: "#3f3f46",
							}}
							onPress={() => handleAddToCart(item)}
						>
							Add to Cart
						</Button>
					</Card>
				))}
			</ScrollView>
			<Card
				style={{
					marginHorizontal: 20,
					marginBottom: 5,

					borderRadius: 10,
				}}
			>
				<Button
					style={{
						position: "fixed",
						bottom: 0,
						width: "100%",
						padding: 10,
						borderRadius: 0,
					}}
					onPress={handlePress}
					icon={"cart"}
				>
					View Cart ({cart?.length})
				</Button>
			</Card>
			<Card
				style={{
					marginHorizontal: 20,
					marginBottom: 20,
					borderRadius: 10,
				}}
			>
				<Button
					style={{
						position: "fixed",
						bottom: 0,
						width: "100%",
						padding: 10,
						borderRadius: 0,
					}}
					onPress={() => {
						router.push({
													pathname: "/pending",
													params: { qr_reference: qr_reference },
												})
					}}
					icon={"cart"}
				>
					View Pending 
				</Button>
			</Card>
		</View>
	);
}

const styles = StyleSheet.create({
	modal: {
		justifyContent: "flex-start",
		justifyContent: "space-between",
		backgroundColor: "white",
		padding: 20,
		alignSelf: "center",
		width: "80%",

		maxWidth: 400,
		height: "80%",
		borderRadius: 10,
		marginHorizontal: 20, // Add horizontal margin
		marginVertical: 0, // Remove or reduce the top margin
	},
	modalTitle: {
		color: "black",
		alignSelf: "center",
		fontSize: 20,
		fontWeight: "bold",
	},
	modalBody: {
		padding: 16,
	},
	input: {
		backgroundColor: "#f0f0f0",
		borderRadius: 8,
		height: 40,
		paddingHorizontal: 12,
		paddingVertical: 8,
		marginBottom: 16,
	},
	optionsContainer: {
		backgroundColor: "#f0f0f0",
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 8,
	},
	optionPlaceholder: {
		color: "#888",
	},
	modalFooter: {
		flexDirection: "row",

		justifyContent: "space-between",

		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 10,
	},
	button: {
		paddingHorizontal: 15,
		paddingVertical: 12,
		borderRadius: 8,
		flex: 1,
		alignContent: "center",
	},
	cancelButton: {
		backgroundColor: "#ccc",
	},
	createButton: {
		backgroundColor: "#F24E1E",
	},

	container: {
		alignItems: "center",
	},
	prompt: {
		fontSize: 18,
		marginBottom: 20,
		color: "white",
	},
	inputContainer: {
		backgroundColor: "#f0f0f0",
		borderRadius: 15,
		paddingHorizontal: 15,
		paddingVertical: 10,
		marginBottom: 20,
		width: 300,
		height: 50,
		justifyContent: "center",
	},

	eventButton: {
		backgroundColor: "white",
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderRadius: 25,
		height: 80,
		width: "80%",
		justifyContent: "center",
		marginBottom: 15,
	},
	eventButtonContent: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	addButton: {
		backgroundColor: "black",
		borderWidth: 2,
		borderColor: "white",
		paddingVertical: 12,
		paddingHorizontal: 30,
		color: "white",
		borderRadius: 25,
		height: 80,
		width: "80%",
		justifyContent: "center",
		marginBottom: 10,
	},
	buttonText: {
		color: "black",
		fontSize: 30,
		fontWeight: "bold",
		alignSelf: "center",
	},
});
