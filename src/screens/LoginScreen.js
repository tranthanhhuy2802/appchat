import { Alert, KeyboardAvoidingView, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigation = useNavigation();

    useEffect(() => {

        const checkLoginStatus = async () => {
            try {

                const token = await AsyncStorage.getItem("authToken");

                if (token) {
                    navigation.replace("Home")
                } else {

                }
            }
            catch (err) {
                console.log(err)
            }
        };
        checkLoginStatus();
    }, []);

    const handleLogin = () => {
        const user = {
            email: email,
            password: password,

        }
        axios.post("http://localhost:8000/login", user).then((res) => {
            console.log(res)
            const token = res.data.token;
            AsyncStorage.setItem('authToken', token);

            navigation.replace("Home")
        }).catch((err) => {
            Alert.alert("err")
            console.log(err)
        })
    }
    return (
        <View style={{ flex: 1, backgroundColor: 'white', padding: 10, alignItems: 'center' }}>
            <KeyboardAvoidingView>
                <View style={{ marginTop: 70, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#4A55A2', fontSize: 17, fontWeight: "bold" }}>Sign In</Text>

                    <Text style={{ fontSize: 17, fontWeight: 'bold', marginTop: 15 }}>Sign In to Your Account</Text>
                </View>

                <View style={{ marginTop: 50 }}>
                    {/* Email */}
                    <View>
                        <Text style={{ fontSize: 18, fontWeight: 600, color: 'gray' }}>Email</Text>
                        <TextInput
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text)
                            }}
                            style={{ fontSize: email ? 18 : 18, borderBottomColor: 'gray', borderBottomWidth: 1, marginVertical: 10, width: 300 }}
                            placeholderTextColor="black"
                            placeholder='enter your mail' />
                    </View>

                    {/* PassWord */}
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ fontSize: 18, fontWeight: 600, color: 'gray' }}>Password</Text>
                        <TextInput
                            value={password}
                            onChangeText={(pass) => {
                                setPassword(pass)
                            }}
                            secureTextEntry={true}
                            style={{ fontSize: email ? 18 : 18, borderBottomColor: 'gray', borderBottomWidth: 1, marginVertical: 10, width: 300 }}
                            placeholderTextColor="black"
                            placeholder='enter your pass' />
                    </View>


                    <Pressable onPress={handleLogin} style={{ width: 200, backgroundColor: '#4A55A2', padding: 15, marginTop: 50, marginLeft: 'auto', marginRight: "auto", borderRadius: 10 }}>
                        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>Login</Text>
                    </Pressable>

                    <Pressable onPress={() => { navigation.navigate("Register") }}>
                        <Text style={{ textAlign: 'center', marginTop: 15, color: 'gray', fontSize: 16 }}>Don't have an Account? Sign Up</Text>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </View>
    )
}

export default LoginScreen

const styles = StyleSheet.create({

})