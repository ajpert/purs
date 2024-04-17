import * as Sharing from "expo-sharing";
import React, { useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import QRCode from "react-native-qrcode-svg";
import ViewShot from "react-native-view-shot";

export default function QrCreator(props) {
	const viewShotRef = useRef(null);
	const LogoFromFile = require("../assets/favicon.png");
	const printToPDF = async () => {
		try {
			const result = await viewShotRef.current.capture();
			const pdf = await Sharing.shareAsync(result, {
				UTI: ".pdf",
				mimeType: "application/pdf",
			});
		} catch (error) {
			console.error("Error printing PDF:", error);
		}
	};
	const data = { qr_reference: props.id, store_id: "1" };
	const stringData = JSON.stringify(data);
	return (
		<>
			<View>
				<Button mode="text" onPress={printToPDF}>
					<Text className="text-black underline">Print QR Code</Text>
				</Button>
				<ViewShot
					style={{ transform: [{ scale: 1.5 }] }}
					ref={viewShotRef}
					options={{ format: "png", quality: 1 }}
				>
					<View style={styles.qrCodeContainer}>
						<QRCode
							logo={LogoFromFile}
							value={stringData}
							size={100}
						/>
					</View>
				</ViewShot>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		width: "100%",
	},
	qrCodeContainer: {
		alignItems: "center",
		justifyContent: "center",
		margin: 20,
	},
});
