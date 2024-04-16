import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useGlobalSearchParams, useLocalSearchParams,useFocusEffect } from "expo-router";
import React, { useEffect, useState, useContext } from "react";
import { Alert, ScrollView, View, StyleSheet } from "react-native";
import { Header } from "react-native-elements";
import { Button, Card, Paragraph, Title } from "react-native-paper";
import { supabase } from "../../../lib/supabase";
import { useSupabaseChannel } from "../../../hooks/useSupabaseChannel";
import { RoleContext } from "../../../context/RoleContext";
import useAuth from "../../../hooks/useAuth";

export default function CustomerCartScreen() {
	const {role} = useContext(RoleContext);
	const {session} = useAuth();
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
		try {
		  // Get the current user
		  const { data: { user } } = await supabase.auth.getUser();
	  
		  if (user) {
			// Filter the cart to keep only items that don't belong to the current user
			const updatedCart = cart.filter((item) => item.owner !== user.id);
	  
			// Update the testData in the database with the filtered cart
			const { error } = await supabase
			  .from('test2')
			  .update({ testData: updatedCart })
			  .eq('qr_id', qr_reference)
			  .select();
	  
			if (error) {
			  console.error('Error updating testData:', error);
			} else {
			  // Navigate back after successful update
			  router.back();
			}
		  } else {
			console.error('No user found');
		  }
		} catch (error) {
		  console.error('Error removing items from cart:', error);
		}
	  };

	const removeFromCart = async (id) => {
		console.log("IN DELETE")
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

	  const handleSelect = async (id) => {
		console.log("IN SELECT")
		const { data: { user } } = await supabase.auth.getUser()
		try {
		  // Find the item with the given id in the testData array
		  const itemToUpdate = cart.find((item) => item.id === id);
	  
		  if (itemToUpdate) {
			// Update the owner field of the item
			itemToUpdate.owner = user.id; // Replace with the desired owner value
	  
			// Create a new array with the updated item
			const updatedData = cart.map((item) => (item.id === id ? itemToUpdate : item));
	  
			// Update the testData in the database
			const { error } = await supabase
			  .from('test2')
			  .update({ testData: updatedData })
			  .eq('qr_id', qr_reference)
			  .select();
	  
			if (error) {
			  console.error('Error updating testData:', error);
			}
		  } else {
			console.error(`Item with id ${id} not found in the cart.`);
		  }
		} catch (error) {
		  console.error('Error updating item in cart:', error);
		}
	  };


	  const ownedItemsCount = cart.filter((item) => item.owner === session?.user?.id).length;
console.log(ownedItemsCount)


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
					<View style={{ 
						filter: 'grayscale(100%)', 
						'-webkit-filter':'grayscale(100%)', 
						
					}}>
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
					<View style={{opacity: (session?.user?.id === item.owner || role == 'Merchant')  ? 1 : 0.3,}}>
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
					</View>
						
						<Button
							mode="contained"
							icon={"close"}
							style={{
								margin: 10,
								borderRadius: 10,
								backgroundColor: "#3f3f46",
								opacity: 2
							}}
							onPress={() => session?.user?.id === item.owner ? removeFromCart(item.id) : handleSelect(item.id)}
						>
							{session?.user?.id === item.owner ? 'Remove from Cart' : 'Select'}
						</Button>
					</Card>
					</View>
					
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
					onPress={role === 'Customer' ? handlePress : () => {}}
					icon={"cart"}
				>
					{ role === 'Customer' ? `Check Out (${ownedItemsCount})` : 'Awaiting Order' }
				</Button>
			</Card>
		</View>
	);
}


