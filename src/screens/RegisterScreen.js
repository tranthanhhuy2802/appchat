import { Alert, KeyboardAvoidingView, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const RegisterScreen = () => {
    const navigation = useNavigation()
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [image, setImage] = useState("");

    const handleRegister = () => {
        const user = {
            name: name,
            email: email,
            password: password,
            image: image
        }

        axios.post("http://localhost:8000/register", user).then((res) => {
            console.log(res);
            Alert.alert("dang ki thanh cong"),
                setName(""),
                setEmail(""),
                setImage(""),
                setPassword("")
        }).catch((err) => {
            Alert.alert("dang ki khong thanh cong"),
                console.log(err)
        })
    }
    return (
        <View style={{ flex: 1, backgroundColor: 'white', padding: 10, alignItems: 'center' }}>
            <KeyboardAvoidingView>
                <View style={{ marginTop: 70, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#4A55A2', fontSize: 17, fontWeight: "bold" }}>Register</Text>

                    <Text style={{ fontSize: 17, fontWeight: 'bold', marginTop: 15 }}>Register to Your Account</Text>
                </View>

                <View style={{ marginTop: 50 }}>
                    {/* Name */}

                    <View>
                        <Text style={{ fontSize: 18, fontWeight: 600, color: 'gray' }}>Name</Text>
                        <TextInput
                            value={name}
                            onChangeText={(name) => {
                                setName(name)
                            }}
                            style={{ fontSize: email ? 18 : 18, borderBottomColor: 'gray', borderBottomWidth: 1, marginVertical: 10, width: 300 }}
                            placeholderTextColor="black"
                            placeholder='enter your name' />
                    </View>
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
                            placeholder='Password' />
                    </View>

                    {/* image */}
                    <View>
                        <Text style={{ fontSize: 18, fontWeight: 600, color: 'gray' }}>Image</Text>
                        <TextInput
                            value={image}
                            onChangeText={(image) => {
                                setImage(image)
                            }}
                            style={{ fontSize: email ? 18 : 18, borderBottomColor: 'gray', borderBottomWidth: 1, marginVertical: 10, width: 300 }}
                            placeholderTextColor="black"
                            placeholder='image' />
                    </View>
                    <Pressable onPress={handleRegister} style={{ width: 200, backgroundColor: '#4A55A2', padding: 15, marginTop: 50, marginLeft: 'auto', marginRight: "auto", borderRadius: 10 }}>
                        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>Register</Text>
                    </Pressable>

                    <Pressable onPress={() => { navigation.navigate("Login") }}>
                        <Text style={{ textAlign: 'center', marginTop: 15, color: 'gray', fontSize: 16 }}>Already Have an acccount? Sign In</Text>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </View>
    )
}

export default RegisterScreen

const styles = StyleSheet.create({})