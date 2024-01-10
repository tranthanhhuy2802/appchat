import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { UserType } from '../navigation/UserContext';
import { useNavigation } from '@react-navigation/native';

const FriendRequest = ({ item, friendRequest, setFriendRequest }) => {

    const navigation = useNavigation()
    const { userId, setUserId } = useContext(UserType);

    const acceptRequest = async (friendRequestId) => {
        try {
            const response = await fetch("http://localhost:8000/friend-req/accept", {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    senderId: friendRequestId,
                    recepientId: userId
                })
            })
            if (response.ok) {
                setFriendRequest(friendRequest.filter((request) => request._id !== friendRequestId))
                navigation.navigate("Chats")
            }
        } catch (error) {
            console.log("err accept")
        }
    }
    return (
        <Pressable style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10 }}>
            <Image style={{ width: 50, height: 50, borderRadius: 25 }} source={{ uri: item.image }} />
            <Text style={{ fontSize: 15, fontWeight: 'bold', marginLeft: 10, flex: 1 }} t>{item?.name} sent you a friend request</Text>
            <Pressable onPress={() => {
                acceptRequest(item._id)
            }} style={{ backgroundColor: '#0066b2', padding: 10, borderRadius: 6 }}>
                <Text style={{ textAlign: 'center', color: 'white' }}>Accept</Text>
            </Pressable>
        </Pressable>
    )
}

export default FriendRequest

const styles = StyleSheet.create({})