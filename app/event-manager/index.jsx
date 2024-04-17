import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { Appbar, Modal, PaperProvider, Portal } from "react-native-paper";
import QrCreator from "../../components/QrCreator";
import { supabase } from "../../lib/supabase";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

function Header(props) {
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
					color={"#F24E1E"}
				/>
			)}

			<Appbar.Content
				title="Event Manager"
				titleStyle={{ color: "white", fontSize: 30 }}
			/>
			<Appbar.Action
				icon="plus"
				color={"#F24E1E"}
				onPress={() => {
					props.showModal();
				}}
			/>
		</Appbar.Header>
	);
}

const EventManager = (props) => {
	const [visible, setVisible] = React.useState(false);
	const [eventName, setEventName] = useState("");
	const showModal = () => setVisible(true);
	const hideModal = () => setVisible(false);
	const [events, setEvents] = useState([]);

	const addNewEvent = async () => {
		try {
			const { data, error } = await supabase
				.from("events")
				.insert({ name: eventName, phone_number: phoneNumber });
			if (error) {
				console.log("Error", error);
			}
			console.log(data);
		} catch (error) {
			console.log("Error", error);
		}
	};

	const getEvents = async () => {
		try {
			const { data, error } = await supabase.from("events").select("*");
			if (error) {
				console.log("Error", error);
			}
			setEvents(data);
		} catch (error) {
			console.log("Error", error);
		}
	};

	useEffect(() => {
		getEvents();
	}, [events]);

	const [phoneNumber, setPhoneNumber] = useState("");

	async function addEvent() {
		if (eventName.trim() === "") {
			// Show a warning or alert if the input is empty or contains only whitespace
			alert("Please enter an event name");
			return;
		}
		await addNewEvent();
		setEventName("");
		hideModal();
	}
	return (
		<PaperProvider>
			<Portal>
				<Modal
					visible={visible}
					onDismiss={hideModal}
					contentContainerStyle={styles.modal}
					presentationStyle="overFullScreen"
				>
					<View style={styles.modalHeader}>
						<Text style={styles.modalTitle}>QR Creation</Text>
					</View>

					<View style={styles.modalBody}>
						<Text
							style={{ alignSelf: "center", fontWeight: "bold" }}
						>
							Name
						</Text>
						<TextInput
							style={styles.input}
							placeholder="Enter Event Name"
							placeholderTextColor="#888"
							value={eventName}
							onChangeText={setEventName}
						/>

						<View style={styles.optionsContainer}>
							<Text style={styles.optionPlaceholder}>
								Options Placeholder
							</Text>
						</View>
					</View>
					<QrCreator />
					<View style={styles.modalFooter}>
						<TouchableOpacity
							style={[styles.button, styles.cancelButton]}
							onPress={hideModal}
						>
							<Text style={styles.buttonText}>Cancel</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={addEvent}
							style={[styles.button, styles.createButton]}
						>
							<Text style={styles.buttonText}>Create</Text>
						</TouchableOpacity>
					</View>
				</Modal>
			</Portal>
			<View style={{ flex: 1, backgroundColor: "black" }}>
				<Header showModal={showModal} />

				<ScrollView>
					<View style={styles.container}>
						{events.map((event) => {
							return (
								<>
									<TouchableOpacity
										id={event.id}
										style={styles.eventButton}
										onPress={() => {
											console.log("YIPEE");
										}}
									>
										<View style={styles.eventButtonContent}>
											{/* Left Icon */}
											<Icon
												name="qrcode"
												size={30}
												color="black"
											/>

											<View
												style={{
													flexDirection: "column",
													alignItems: "flex-start",
													justifyContent:
														"flex-start",
													width: "50%",
												}}
											>
												<Text style={styles.buttonText}>
													{event.name}
												</Text>

												<Text
													style={{
														color: "black",
														fontSize: 15,
													}}
												>
													Created:{" "}
													{new Date(
														event.created_at
													).toLocaleTimeString([], {
														hour: "2-digit",
														minute: "2-digit",
														hour12: true,
													})}
												</Text>
											</View>

											{/* Right Icon */}
											<Icon
												name="arrow-right-bold"
												size={30}
												color="black"
											/>
										</View>
									</TouchableOpacity>
								</>
							);
						})}
					</View>
				</ScrollView>
			</View>
		</PaperProvider>
	);
};

const styles = StyleSheet.create({
	modal: {
		justifyContent: "flex-start",
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
	},
	cancelButton: {
		backgroundColor: "#ccc",
	},
	createButton: {
		backgroundColor: "#Fe24E1E",
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
	},
});

export default EventManager;
