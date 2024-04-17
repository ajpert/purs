import { CameraView, useCameraPermissions } from "expo-camera/next";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
export default function App() {
	const [facing, setFacing] = useState("back");
	const [permission, requestPermission] = useCameraPermissions();
	const [clicked, setClicked] = useState(false);
	const [invalidQRCode, setInvalidQRCode] = useState(false);
	const [stopScanning, setStopScanning] = useState(false);

	const [isCameraMounted, setIsCameraMounted] = useState(false);

	useEffect(() => {
		const permisionFunction = async () => {
			const permission = await requestPermission();
			console.log(permission);
			if (permission.granted !== true) {
				alert(
					"Permission for media access needed, please give camera access"
				);
			}
		};
		permisionFunction();
	}, []);

	useFocusEffect(
		useCallback(() => {
			setIsCameraMounted(true);
			return () => {
				setIsCameraMounted(false);
			};
		}, [])
	);

	function handleClick() {
		setClicked(true);
	}

	const [scanned, setScanned] = useState(null);

	const handleScan = (data) => {
		console.log(data.data);
		try {
			const scannedData = JSON.parse(data.data);
			console.log(scannedData);
			if (scannedData.store_id && scannedData.qr_reference) {
				setScanned(data);
				setInvalidQRCode(false);

				setIsCameraMounted(false);
				router.push({
					pathname: "/storefront/customer",
					params: { qr_reference: scannedData.qr_reference },
				});
			} else {
				console.log("Invalid QR code format");
				setInvalidQRCode(true);
			}
		} catch (error) {
			console.log("Error parsing scanned data:", error);
			setInvalidQRCode(true);
		}
	};

	function toggleCameraFacing() {
		setFacing((current) => (current === "back" ? "front" : "back"));
	}

	return (
		<View style={styles.container}>
			{isCameraMounted ? (
				<CameraView
					barcodeScannerSettings={{
						barcodeTypes: ["qr"],
					}}
					onBarcodeScanned={stopScanning ? undefined : handleScan}
					style={styles.camera}
					facing={facing}
				>
					<View style={styles.scanAreaContainer}>
						<View style={styles.scanAreaSquare} />
						{invalidQRCode && (
							<Text style={styles.invalidQRCodeText}>
								Unrecognizable QR code
							</Text>
						)}
						<View style={styles.buttonContainer}>
							<Text style={styles.text}>Scan Qr Code</Text>
						</View>
					</View>
				</CameraView>
			) : (
				<Text>Camera is not mounted</Text>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "black",
		color: "white",
	},
	camera: {
		width: "100%",
		height: "100%",
		justifyContent: "center",
		alignItems: "center",
	},
	scanAreaContainer: {
		width: "80%",
		height: "80%",
		alignItems: "center",
		justifyContent: "center",
	},
	scanAreaSquare: {
		width: 200,
		height: 200,
		borderWidth: 2,
		borderRadius: 25,
		borderColor: "white",
	},
	buttonContainer: {
		flex: 1,
		flexDirection: "row",
		backgroundColor: "transparent",
		margin: 64,
	},
	button: {
		flex: 1,
		alignSelf: "flex-end",
		alignItems: "center",
	},
	text: {
		fontSize: 24,
		fontWeight: "bold",
		color: "white",
	},
	invalidQRCodeText: {
		color: "red",
		fontSize: 18,
		marginTop: 10,
	},
});
