import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useGlobalSearchParams, useLocalSearchParams,useFocusEffect } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { Header } from "react-native-elements";
import { Button, Card, Paragraph, Title } from "react-native-paper";
import { supabase } from "../../../lib/supabase";
import { useSupabaseChannel } from "../../../hooks/useSupabaseChannel";


export default function CustomerCartScreen() {


	const { qr_reference } = useLocalSearchParams();
	const [cart, setCart] = useState([]);


	useFocusEffect(
		React.useCallback(() => {
			const fetchInitialData = async () => {
				try {
					const { data: getTest, error: errorTest } = await supabase
						.from('test2')
						.select('testData')
						.eq('qr_id', qr_reference)
						.single();

					if (errorTest) {
						console.error('Error fetching initial testData1:', errorTest);
					} else {
						setCart(getTest.testData);
					}
				} catch (error) {
					console.error('Error fetching initial data2:', error);
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
						console.log(payload.new.testData);
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
		const { error } = await supabase
		.from('test2')
		.update({ testData: [] })
		.eq('qr_id', qr_reference)
		.select();

		router.back();
	};

	const removeFromCart = async (id) => {
		try {

		  // Remove the item with the given id from the testData array
		  const updatedData = cart.filter((item) => item.id !== id);
	  
		  // Update the testData in the database
		  const { error } = await supabase
			.from('test2')
			.update({ testData: updatedData })
			.eq('qr_id', qr_reference)
			.select();
	  
		  if (error) {
			console.error('Error updating testData:', error);
		  }
		} catch (error) {
		  console.error('Error removing item from cart:', error);
		}
	  };






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
					Check Out ({cart?.length})
				</Button>
			</Card>
		</View>
	);
}
