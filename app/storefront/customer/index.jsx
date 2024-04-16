import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import React, { useState, useEffect } from "react";
import { ScrollView, View } from "react-native";
import { Header } from "react-native-elements";
import { Button, Card, Paragraph, Title } from "react-native-paper";

import { supabase } from "../../../lib/supabase";
import { useLocalSearchParams } from "expo-router";

import { useAuth } from "../../../hooks/useAuth";
import { useSupabaseChannel } from "../../../hooks/useSupabaseChannel";


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
		imageUrl: "http://placebacon.net/400/300?image=1",
	},
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
		imageUrl: "http://placebacon.net/400/300?image=1",
	},
	{
		id: randomUUID(),
		name: "Bacon",
		description: "The best bacon in town.",
		imageUrl: "http://placebacon.net/400/300?image=1",
	},
];

export default function CustomerStoreFront() {

	const { qr_reference } = useLocalSearchParams()

	const [session, setSession] = useState(null);

	const [data, setData] = useState(null);

	const [cart, setCart] = useState([]);

	const temp = useSupabaseChannel("test2", qr_reference)

	console.log("TEMP", temp.length)


	useFocusEffect(
		React.useCallback(() => {
			const fetchInitialData = async () => {
				try {
					const { data: getTest, error: errorTest } = await supabase
						.from('test2')
						.select('testData')
						.eq('id', qr_reference)
						.single();

					if (errorTest) {
						console.error('Error fetching initial testData:', errorTest);
					} else {
						setCart(getTest.testData);
					}
				} catch (error) {
					console.error('Error fetching initial data:', error);
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
						filter: `id=eq.${qr_reference}`,
					},
					(payload) => {

						setCart(payload.new.testData);
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
			params: { qr_reference: qr_reference },
		});

	};

	const handleAddToCart = async () => {
		try {
			// Fetch the existing testData from the database
			const { data: getTest, error: errorTest } = await supabase
				.from('test2')
				.select('testData')
				.eq('id', qr_reference)
				.single();

			if (errorTest) {
				console.error('Error fetching testData:', errorTest);
				return;
			}

			// Create a new item to be added
			const newItem = {
				id: randomUUID(),
				name: 'Bacon',
				description: 'The best bacon in town.',
				imageUrl: 'http://placebacon.net/400/300?image=1',
			};

			// Combine the existing testData with the new item
			const newData = [...getTest.testData, newItem];

			// Update the testData in the database
			const { data, error } = await supabase
				.from('test2')
				.update({ testData: newData })
				.eq('id', qr_reference)
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
			<Header
				leftComponent={<Button title="Back" style={{ backgroundColor: 'white' }} onPress={() => router.back()} />}
				centerComponent={{
					text: "Storefront",
					style: {
						color: "#fff",
						fontSize: 32,
						fontWeight: "bold",
					},
				}}

				containerStyle={{
					backgroundColor: "#171717",
				}}
			/>

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
							onPress={handleAddToCart}
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
