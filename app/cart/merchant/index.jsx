import { router } from "expo-router";
import React from "react";
import { ScrollView } from "react-native";
import { Avatar, Card, Paragraph, Title } from "react-native-paper";

const mockData = [
	{
		id: 1,
		name: "Apple iPhone 13",
		description: "The latest iPhone model with A15 Bionic chip.",
		imageUrl: "http://placebacon.net/400/300?image=1",
	},
	{
		id: 2,
		name: "Samsung Galaxy S22",
		description:
			"Experience next generation smartphone with dynamic AMOLED display.",
		imageUrl: "http://placebacon.net/400/300?image=1",
	},
	{
		id: 3,
		name: "Google Pixel 6",
		description: "The best camera phone with 50MP sensor.",
		imageUrl: "http://placebacon.net/400/300?image=1",
	},
	{
		id: 4,
		name: "Apple iPhone 13",
		description: "The latest iPhone model with A15 Bionic chip.",
		imageUrl: "http://placebacon.net/400/300?image=1",
	},
	{
		id: 5,
		name: "Samsung Galaxy S22",
		description:
			"Experience next generation smartphone with dynamic AMOLED display.",
		imageUrl: "http://placebacon.net/400/300?image=1",
	},
	{
		id: 6,
		name: "Google Pixel 6",
		description: "The best camera phone with 50MP sensor.",
		imageUrl: "http://placebacon.net/400/300?image=1",
	},
];

export default function MerchantCartScreen() {
	const handlePress = () => {
		router.push("/storefront/customer");
	};
	return (
		<ScrollView>
			{mockData.map((item) => (
				<Card
					key={item.id}
					style={{ margin: 10 }}
					onPress={handlePress}
				>
					<Card.Content>
						<Avatar.Image
							size={24}
							source={{ uri: item.imageUrl }}
						/>
						<Title>{item.name}</Title>
						<Paragraph>{item.description}</Paragraph>
					</Card.Content>
					<Card.Cover source={{ uri: item.imageUrl }} />
				</Card>
			))}
		</ScrollView>
	);
}
