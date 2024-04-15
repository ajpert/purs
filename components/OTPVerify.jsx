import { router } from "expo-router";
import React, { useState } from "react";
import { AppState, StyleSheet, Text, View } from "react-native";
import { Button, Input } from "react-native-elements";
import { supabase } from "../lib/supabase";

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener("change", (state) => {
	if (state === "active") {
		supabase.auth.startAutoRefresh();
	} else {
		supabase.auth.stopAutoRefresh();
	}
});

export default function OTPVerify({ phone }) {
	const [otp, setOtp] = useState("");
	const [loading, setLoading] = useState(false);

	async function verifyOtp() {
		if (!otp) return;
		setLoading(true);
		const {
			data: { session },
			error,
		} = await supabase.auth.verifyOtp({
			phone: `1${phone}`,
			token: otp,
			type: "sms",
		});

		if (error) {
			setLoading(false);
			Alert.alert(error.message);
		} else {
			setLoading(false);
			router.push("/scan");
		}
	}

	return (
		<View style={styles.container}>
			<Text style={styles.header}>Verify your phone number</Text>
			<View style={[styles.verticallySpaced, styles.mt20]}>
				<Input
					label="OTP"
					leftIcon={{ type: "font-awesome", name: "lock" }}
					value={otp}
					keyboardType="number-pad"
					onChangeText={setOtp}
				/>
			</View>
			<View style={[styles.verticallySpaced, styles.mt20]}>
				<Button title="Verify" onPress={verifyOtp} disabled={loading} />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginTop: 40,
		padding: 12,
	},
	verticallySpaced: {
		paddingTop: 4,
		paddingBottom: 4,
		alignSelf: "stretch",
	},
	mt20: {
		marginTop: 20,
	},
	header: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 20,
		textAlign: "center",
	},
});
