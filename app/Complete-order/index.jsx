import React, { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';

 const CompleteScreen = () => {
   const fadeAnim = useRef(new Animated.Value(0)).current;  
   const fadeAnim2 = useRef(new Animated.Value(0)).current;
   const fadeAnim3 = useRef(new Animated.Value(0)).current;
   const fadeAnim4 = useRef(new Animated.Value(0)).current;
   const lineHeight = useRef(new Animated.Value(0)).current;  
   const lineHeight2 = useRef(new Animated.Value(0)).current;
   const lineHeight3 = useRef(new Animated.Value(0)).current;
   const lineHeight4 = useRef(new Animated.Value(0)).current;


   useEffect(() => {
     Animated.timing(fadeAnim, {
       toValue: 1,
       duration: 2000,
       useNativeDriver: true,
     }).start();
   }, []);  

   useEffect(() => {
     Animated.timing(fadeAnim2, {
       toValue: 1,
       duration: 6000,
       useNativeDriver: true,
     }).start();
   }, []);  

   useEffect(() => {
     Animated.timing(fadeAnim3, {
       toValue: 1,
       duration: 12000,
       useNativeDriver: true,
     }).start();
   }, []);

   useEffect(() => {
     Animated.timing(fadeAnim4, {
       toValue: 1,
       duration: 16000,
       useNativeDriver: true,
     }).start();
   }, []);

   useEffect(() => {
     Animated.timing(lineHeight, {
       toValue: 1,
       duration: 2000,
       useNativeDriver: false,
     }).start();
   }, []);

   useEffect(() => {
     Animated.timing(lineHeight2, {
       toValue: 1,
       duration: 6000,
       useNativeDriver: false,
     }).start();
   }, []);

   useEffect(() => {
     Animated.timing(lineHeight3, {
       toValue: 1,
       duration: 12000,
       useNativeDriver: false,
     }).start();
   }
   , []);


   return (
     <View style={styles.container}>
       <Animated.Text
         style={{
           ...styles.text,
           opacity: fadeAnim,  
         }}>
         Order Sent 
       </Animated.Text>

       <View style={styles.lineContainer}>
         <Animated.View
           style={{
             ...styles.lineStyle,
             height: lineHeight.interpolate({
               inputRange: [0, 1],
               outputRange: [0, 100],  
             }),
           }}
         />
       </View>
         <Animated.Text
             style={{
             ...styles.text,
             opacity: fadeAnim2,  
             }}
         >
             Order Received 
         </Animated.Text>
         <Animated.View
             style={{
             ...styles.lineStyle,
             height: lineHeight2.interpolate({
                 inputRange: [0, 1],
                 outputRange: [0, 100],  
             }),
             }}
         />
         <Animated.Text
             style={{
             ...styles.text,
             opacity: fadeAnim3,  
             }}>
             Working on Order 
         </Animated.Text>

         <Animated.View
             style={{
             ...styles.lineStyle,
             height: lineHeight3.interpolate({
                 inputRange: [0, 1],
                 outputRange: [0, 100], 
             }),
             }}
         />

         <Animated.Text
             style={{
             ...styles.text,
             opacity: fadeAnim4,
             color: '#3FC060',  
             }}>
             Order Complete 
         </Animated.Text>
     </View>
   );
 };

 const styles = {
   container: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
     backgroundColor: 'black',


   },
   text: {
     fontSize: 32,
     textAlign: 'center',
     margin: 10,
     color: 'white',
   },
   lineContainer: {
     alignItems: 'flex-start',  
   },
   lineStyle:{
     borderWidth: 2,
     borderColor:'white',
     margin:10,
     borderRadius: 30,
   }
 };
 export default CompleteScreen;