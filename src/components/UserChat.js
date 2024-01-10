import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { UserType } from '../navigation/UserContext'

const UserChat = ({ item }) => {
    const { userId, setUserId } = useContext(UserType)
    const navigation = useNavigation();
    const [messages, setMessages] = useState([])

    const formatTime = (time) => {
        const options = { hour: "numeric", minute: "numeric" };
        return new Date(time).toLocaleString("en-US", options)
    }
    const fetchMessage = async () => {
        try {
            const response = await fetch(`http://localhost:8000/message/${userId}/${item._id}`)
            const data = await response.json()

            if (response.ok) {
                setMessages(data)
            } else {
                console.log("error show message", response.status.message)
            }
        } catch (error) {
            console.log(error, "fetching message")
        }
    }
    useEffect(() => {
        fetchMessage()
    }, [])
    const getLastMessage = () => {
        const userMessage = messages.filter((message) => message.messageType === 'text')
        const n = userMessage.length;
        return userMessage[n - 1];
    }
    const lastMessage = getLastMessage()
    console.log("last mess", lastMessage)
    console.log("mess", messages)

    return (
        <Pressable
            onPress={() => navigation.navigate('Messages'
                , {
                    recepientId: item._id
                })}

            style={{ flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 0.7, borderColor: "#D0D0D0", borderTopWidth: 0, borderLeftWidth: 0, borderRightWidth: 0, padding: 10 }}>
            <Image style={{ width: 50, height: 50, resizeMode: 'cover', borderRadius: 25 }} source={{ uri: item?.image }} />
            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '500' }}>{item?.name}</Text>
                {lastMessage && (
                    <Text style={{ marginTop: 4, color: 'gray', fontWeight: '500' }}>{lastMessage?.message}</Text>
                )}
            </View>
            <View>
                <Text style={{ fontSize: 11, fontWeight: '400', color: '#585858' }}>{lastMessage && formatTime(lastMessage?.timeStamp)}</Text>
            </View>
        </Pressable>
    )
}

export default UserChat

const styles = StyleSheet.create({})