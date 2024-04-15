import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { Header } from "react-native-elements";
import { Button, Card, Paragraph, Title } from "react-native-paper";

export default function CustomerCartScreen() {
	const [cart, setCart] = useState([]);

	const handlePress = () => {
		router.push("/storefront/customer");
	};

	const removeFromCart = (id) => {
		setCart(cart.filter((item) => item.id !== id));
	};

	const getData = async () => {
		const data = await AsyncStorage.getItem("cart");
		if (data) {
			setCart(JSON.parse(data));
		} else {
			Alert.alert("No items in cart");
		}
	};

	useEffect(() => {
		getData();
	}, []);

	return (
		<View style={{ flex: 1, backgroundColor: "#171717" }}>
			<Header
				centerComponent={{
					text: "C sCart",
					style: { color: "#fff", fontSize: 32, fontWeight: "bold" },
				}}
				containerStyle={{ backgroundColor: "#171717" }}
			/>

			<ScrollView style={{ padding: 10, marginTop: 32 }}>
				{cart.map((item) => (
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
							icon={"close"}
							style={{
								margin: 10,
								borderRadius: 10,
								backgroundColor: "#3f3f46",
							}}
							onPress={() => removeFromCart(item.id)}
						>
							Remove from Cart
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
					View Cart ({cart.length})
				</Button>
			</Card>
		</View>
	);
}
