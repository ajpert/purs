import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect, useNavigation, useRouter } from "expo-router";
import React, { useState, useEffect, useContext } from "react";
import { ScrollView, View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Header } from "react-native-elements";
import { Button, Card, Paragraph, Title, Appbar, Portal, Modal, Switch } from "react-native-paper";

import { supabase } from "../../../lib/supabase";
import { useLocalSearchParams } from "expo-router";

import { useAuth } from "../../../hooks/useAuth";
import { useSupabaseChannel } from "../../../hooks/useSupabaseChannel";
import { RoleContext } from "../../../context/RoleContext";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

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
				titleStyle={{ color: "white", fontSize: 30 }}
			/>
			<Appbar.Action
				icon="cog"
				color={"white"}
				onPress={() => {
					props.showModal()
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
		name: "Bacon",
		description: "The best bacon in town.",
		imageUrl: "http://placebacon.net/400/300?image=1",
	},
	{
		id: randomUUID(),
		name: "Bacon",
		description: "The best bacon in town.",
		imageUrl: "http://placebacon.net/400/300?image=2",
	},
	{
		id: randomUUID(),
		name: "Bacon",
		description: "The best bacon in town.",
		imageUrl: "http://placebacon.net/400/300?image=3",
	},
	{
		id: randomUUID(),
		name: "Bacon",
		description: "The best bacon in town.",
		imageUrl: "http://placebacon.net/400/300?image=4",
	},
	{
		id: randomUUID(),
		name: "Bacon",
		description: "The best bacon in town.",
		imageUrl: "http://placebacon.net/400/300?image=5",
	},
];

export default function CustomerStoreFront() {
	const { role } = useContext(RoleContext);
	console.log("ROLE", role)
	const { qr_reference } = useLocalSearchParams()

	const [session, setSession] = useState(null);

	const [data, setData] = useState(null);

	const [cart, setCart] = useState([]);


	const [visible, setVisible] = useState(false);

	const hideModal = () => setVisible(false);
	const showModal = () => setVisible(true);

	const [isSwitchOn, setIsSwitchOn] = React.useState(false);

	const onToggleSwitch = () => { fetchData(); setIsSwitchOn(!isSwitchOn)};

	//const temp = useSupabaseChannel("test2", qr_reference)

	//console.log("TEMP", temp.length)
	const fetchData = async () => {
		try {
			const { data: { user } } = await supabase.auth.getUser();
			const { data: getTest, error: errorTest } = await supabase
				.from('test2')
				.select('testData')
				.eq('qr_id', qr_reference)
				.single();

			if (errorTest) {
				console.error('Error fetching initial testData3:', errorTest);
			} else {
				if (!isSwitchOn) {
					console.log("SWITCH ON")
					const arr = getTest.testData.filter((item) => item.owner === user.id);
					setCart(arr);
				}
				else {
					setCart(getTest.testData);
				}
			}
		} catch (error) {
			console.error('Error fetching initial data4:', error);
		}
	};

	useFocusEffect(
		React.useCallback(() => {
			const fetchInitialData = async () => {
				try {
					const { data: { user } } = await supabase.auth.getUser();
					const { data: getTest, error: errorTest } = await supabase
						.from('test2')
						.select('testData')
						.eq('qr_id', qr_reference)
						.single();

					if (errorTest) {
						console.error('Error fetching initial testData3:', errorTest);
					} else {
						if (isSwitchOn) {
							const arr = getTest.testData.filter((item) => item.owner === user.id);
							setCart(arr);
						}
						else {
							setCart(getTest.testData);
						}
					}
				} catch (error) {
					console.error('Error fetching initial data4:', error);
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
						table: 'test2',
						filter: `qr_id=eq.${qr_reference}`,
					},
					(payload) => {

						if (isSwitchOn) {
							const arr = payload.new.testData.filter((item) => item.owner === user.id);
							setCart(arr);
						}
						else {
							setCart(payload.new.testData);
						}
					}
				)
				.subscribe();

			return () => {
				channel.unsubscribe();
			}
		}, [])
	)


	const handlePress = async () => {
		await AsyncStorage.setItem("cart", JSON.stringify(cart));
		router.push({
			pathname: "/cart/customer",
			params: { qr_reference: qr_reference, ownItems: isSwitchOn },
		});

	};

	const handleAddToCart = async (item) => {
		const { data: { user } } = await supabase.auth.getUser()
		try {
			// Fetch the existing testData from the database
			const { data: getTest, error: errorTest } = await supabase
				.from('test2')
				.select('testData')
				.eq('qr_id', qr_reference)
				.single();

			if (errorTest) {
				console.error('Error fetching testData5:', errorTest);
				return;
			}

			// Create a new item to be added
			const newItem = {
				id: randomUUID(),
				name: 'Bacon',
				description: 'The best bacon in town.',
				imageUrl: 'http://placebacon.net/400/300?image=1',
			};
			item.id = randomUUID();

			if (role === "Customer") {
				item.owner = user.id;
			}
			else {
				console.log("ADDING FROM MERCHANT")
				item.owner = ""
			}


			// Combine the existing testData with the new item
			const newData = [...getTest.testData, item];

			// Update the testData in the database
			const { data, error } = await supabase
				.from('test2')
				.update({ testData: newData })
				.eq('qr_id', qr_reference)
				.select();

			if (error) {
				console.error('Error updating testData:', error);
				return;
			}



			// Update the local cart state

		} catch (error) {
			console.error('Error handling AddToCart:', error);
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
						<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
						<Text style={{ fontWeight: 'bold' }}>Only See My Items</Text>
	<Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
    
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
							<Title style={{ color: "#fff" }}>{item.name}</Title>
							<Paragraph style={{ color: "#fff" }}>
								{item.description}
							</Paragraph>
						</Card.Content>
						<Card.Cover
							source={{ uri: item.imageUrl }}
							style={{ objectFit: "cover", height: 100 }}
						/>
						<Button
							mode="contained"
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
					margin: 20,
					padding: 10,
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
		</View>
	);
}

const styles = StyleSheet.create({
	modal: {
		justifyContent: "flex-start",
		justifyContent: 'space-between',
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
