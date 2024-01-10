import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { UserType } from '../navigation/UserContext'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'
import jwt_decode from "jwt-decode";


import User from '../components/User.js'


const HomeScreen = () => {
    const navigation = useNavigation();
    const { userId, setUserId } = useContext(UserType)
    const [users, setUsers] = useState([]);
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "",
            headerLeft: () => (
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Swift Chat</Text>
            ),
            headerRight: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Icon onPress={() => navigation.navigate("Chats")} name='comment-dots' size={20} />
                    <Icon onPress={() => navigation.navigate("Friends")} name='user-friends' size={20} />
                </View>
            )
        })
    }, []);
    // useEffect(() => {
    //     const fetchUsers = async () => {
    //         const token = await AsyncStorage.getItem("authToken");
    //         console.log("Token", token)
    //         const decodedToken = jwt_decode(token);
    //         console.log(decodedToken)
    //         const userId = decodedToken.userId
    //         setUserId(userId)
    //         axios.get(`http://localhost:8000/users/${userId}`).then((res) => {
    //             setUsers(res.data)
    //         }).catch((err) => {
    //             console.log(err)
    //         })
    //     };
    //     fetchUsers();
    // }, [])
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = await AsyncStorage.getItem("authToken");

                if (!token) {
                    console.error("Token is null or undefined");
                    return;
                }

                const decodedToken = jwt_decode(token);
                console.log(decodedToken);

                const userId = decodedToken.userId;
                setUserId(userId);

                const response = await axios.get(`http://localhost:8000/users/${userId}`);
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    console.log("user", users)
    return (
        <View>
            <View style={{ padding: 10 }}>
                {users.map((item, index) => {
                    return (
                        <User key={index} item={item} />
                    )
                })}
            </View>
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({})