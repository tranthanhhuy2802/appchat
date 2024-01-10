import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { UserType } from '../navigation/UserContext';
import { useNavigation } from '@react-navigation/native';
import UserChat from '../components/UserChat';

const ChatsScreen = () => {
    const [acceptedFriends, setAcceptFriends] = useState([]);
    const { userId, setUserId } = useContext(UserType);
    const navigation = useNavigation();
    useEffect(() => {
        const acceptedFriends = async () => {
            try {
                const response = await fetch(`http://localhost:8000/accepted-friends/${userId}`)
                const data = await response.json();

                if (response.ok) {
                    setAcceptFriends(data)
                }
            } catch (error) {
                console.log("error showing the accepted friends", error)
            }
        }
        acceptedFriends();
    }, [])
    console.log("friend", acceptedFriends)
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <Pressable>
                {acceptedFriends.map((item, index) => {
                    return (

                        <UserChat key={index} item={item} />
                    )
                })}
            </Pressable>

        </ScrollView>
    )
}

export default ChatsScreen

const styles = StyleSheet.create({})