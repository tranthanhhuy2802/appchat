import { Image, KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import EmojiSelector from 'react-native-emoji-selector'
import { UserType } from '../navigation/UserContext'
import { useNavigation, useRoute } from '@react-navigation/native'
import * as ImagePicker from 'react-native-image-picker';
// import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const ChatMessageScreen = () => {
    const [showEmojiSelector, setShowEmojiSelector] = useState(false)
    const [recepientData, setRecepientData] = useState();
    const [messages, setMessages] = useState([]);
    const navigation = useNavigation();
    const [message, setMessage] = useState("")
    const [selectedImage, setSelectedImage] = useState("")
    const [selectedMessage, setSelectedMessage] = useState([])
    const { userId, setUserId } = useContext(UserType);
    const route = useRoute()
    const { recepientId } = route.params

    const scrollViewRef = useRef(null)
    useEffect(() => {
        scrollBottom()
    }, [])
    const scrollBottom = () => {
        if (scrollViewRef.current) { scrollViewRef.current.scrollToEnd({ animated: false }) }
    }

    const handleContentSizeChange = () => {
        scrollBottom()
    }
    const handleEmojiPress = () => {
        setShowEmojiSelector(!showEmojiSelector)
    }
    const fetchMessage = async () => {
        try {
            const response = await fetch(`http://localhost:8000/message/${userId}/${recepientId}`)
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

    useEffect(() => {
        const fetchRecepiendData = async () => {
            try {
                const response = await fetch(`http://localhost:8000/user/${recepientId}`);
                const data = await response.json();
                setRecepientData(data)
            } catch (error) {
                console.log("error retrieving details", error)

            }
        }
        fetchRecepiendData()
    }, [])

    const handleSend = async (messageType, imageUri) => {
        try {
            const formData = new FormData()
            formData.append("senderId", userId)
            formData.append("recepientId", recepientId)

            if (messageType === 'image') {
                formData.append("messageType", "image")
                formData.append('imageFile', {
                    uri: imageUri,
                    name: "image.jpg",
                    type: "image/jpeg"
                })
            } else {
                formData.append("messageType", "text")
                formData.append("messageText", message)

            }
            const response = await fetch("http://localhost:8000/message", {
                method: 'post',
                body: formData
            })
            if (response.ok) {
                setMessage("");
                setSelectedImage("");
                fetchMessage()
            }
        } catch (error) {
            console.log("error in sending the message", error)

        }
    }

    const deleteMessage = async (messageId) => {
        try {
            const response = await fetch("http://localhost:8000/deleteMessage", {
                method: 'post',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: messageId })
            });
            if (response.ok) {
                setSelectedMessage((prevSelectedMessages) => prevSelectedMessages.filter((id) => !messageId.includes(id)));
                fetchMessage();
            } else {
                console.log("error deleting messages", response.status)
            }
        } catch (error) {
            console.log(error)
        }

    }
    // console.log("recepientData", recepientData)
    // console.log("mess", messages)
    useLayoutEffect(() => {
        navigation.setOptions(
            {
                headerTitle: "",
                headerLeft: () => (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Icon onPress={() => navigation.goBack()} name='angle-left' size={24} />
                        {selectedMessage.length > 0 ? (<View>
                            <Text style={{ fontSize: 16, fontWeight: '500' }}>{selectedMessage.length}</Text>
                        </View>) : (

                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>

                                <Image style={{ width: 30, height: 30, borderRadius: 15, resizeMode: 'cover' }} source={{ uri: recepientData?.image }} />
                                <Text style={{ marginLeft: 5, fontSize: 15, fontWeight: 'bold' }}>{recepientData?.name}</Text>
                            </View>
                        )
                        }

                    </View >
                ),
                headerRight: () => selectedMessage.length > 0 ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>

                        <Icon name='share' size={24} color='black' />
                        <Icon name='reply' size={24} color='black' />
                        <Icon name='star' size={24} color='black' />
                        <Icon onPress={() => deleteMessage(selectedMessage)} name='trash' size={24} color='black' />

                    </View>
                ) : null,
            }
        )
    }, [recepientData, selectedMessage])

    const formatTime = (time) => {
        const options = { hour: "numeric", minute: "numeric" };
        return new Date(time).toLocaleString("en-US", options)
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibrary({
        })
        // console.log("uri", result.assets[0]?.uri);
        if (!result.canceled) {
            handleSend("image", result.assets[0].uri)
        }
    }
    const handleSelectMessage = (message) => {
        const isSelected = selectedMessage.includes(message._id);
        if (isSelected) {
            setSelectedMessage((previousMessages) =>
                previousMessages.filter((id) => id !== message._id)
            )
        } else {
            setSelectedMessage((previousMessages) => [...previousMessages, message._id])
        }

    }
    // const openImagePicker = () => {
    //     const options = {
    //         title: 'Select Image',
    //         storageOptions: {
    //             skipBackup: true,
    //             path: 'images',
    //         },
    //     };

    //     try {
    //         ImagePicker.launchImageLibrary(options, (response) => {
    //             if (response.didCancel) {
    //                 console.log('User cancelled image picker');
    //             } else if (response.error) {
    //                 console.log('ImagePicker Error: ', response.error);
    //             } else {
    //                 // Save the image URI and update the state
    //                 const source = { uri: response.uri };
    //                 setImageSource(source);
    //             }
    //         });
    //     } catch (error) {
    //         console.error('Error in opening image picker:', error);
    //     }
    // };
    console.log("first", selectedMessage)
    return (
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#F0F0F0' }}>
            <ScrollView ref={scrollViewRef} contentContainerStyle={{ flexGrow: 1 }} onContentSizeChange={handleContentSizeChange}>
                {messages.map((item, index) => {
                    if (item.messageType === "text") {
                        const isSelected = selectedMessage.includes(item._id);
                        return (
                            <Pressable
                                onPress={() => handleSelectMessage(item)}
                                key={index} style={[item?.senderId?._id === userId ? { alignSelf: "flex-end", backgroundColor: '#DCF8C6', padding: 8, maxWidth: "60%", borderRadius: 7, margin: 10 } : {
                                    alignSelf: 'flex-start',
                                    backgroundColor: 'white',
                                    padding: 8,
                                    margin: 10,
                                    borderRadius: 7,
                                    maxWidth: '60%'
                                },
                                isSelected && { width: "100%", backgroundColor: "#F0FFFF" }
                                ]}>
                                <Text style={{ fontSize: 13, textAlign: isSelected ? "right" : "left" }}>{item?.message}</Text>
                                <Text style={{ color: 'gray', textAlign: 'right', fontSize: 9, marginTop: 5 }}>{formatTime(item.timeStamp)}</Text>
                            </Pressable>
                        )
                    }
                    if (item.messageType === "image") {

                        const baseUrl = "/Users/tranthanhhuy/Documents/Apps/Applaudry/src/api/files/";
                        const imageUrl = item.imageUrl;
                        const filename = imageUrl.split("/").pop();
                        const source = { uri: baseUrl + filename }
                        return (
                            <Pressable key={index}
                                style={[item?.senderId?._id === userId ? { alignSelf: "flex-end", backgroundColor: '#DCF8C6', padding: 0, maxWidth: "60%", borderRadius: 7, margin: 10 } : {
                                    alignSelf: 'flex-start',
                                    backgroundColor: 'white',
                                    padding: 8,
                                    margin: 10,
                                    borderRadius: 7,
                                    maxWidth: '60%'
                                }]}>
                                <View>
                                    <Image source={source} style={{ width: 200, height: 200, borderRadius: 7 }} />
                                    <Text style={{ textAlign: 'right', fontSize: 9, color: 'gray', position: 'absolute', right: 10, marginTop: 5 }}>{formatTime(item?.timeStamp)}</Text>
                                </View>
                            </Pressable>
                        )
                    }
                })}
            </ScrollView>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 10, borderTopWidth: 1, borderTopColor: "#dddddd", marginBottom: showEmojiSelector ? 0 : 25 }}>
                <Icon
                    onPress={() => handleEmojiPress()}
                    style={{ marginRight: 10 }} name='smile' size={24} color='gray' />
                <TextInput value={message} onChangeText={(text) => setMessage(text)} style={{ flex: 1, height: 40, borderWidth: 1, borderColor: '#dddddd', borderRadius: 20, paddingHorizontal: 10 }} placeholder='Type Your Message...' />
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginHorizontal: 8 }}>
                    {/* camera */}
                    <Icon onPress={() => pickImage()} style={{}} name='camera' size={24} color='gray' />
                    {/* Microphone */}
                    <Icon name='microphone' size={24} color='gray' />
                </View>
                <Pressable onPress={() => handleSend("text")} style={{ backgroundColor: '#007bff', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, marginLeft: 10 }}>
                    <Text style={{ color: 'white' }}>Send</Text>
                </Pressable>
            </View>
            {showEmojiSelector && (
                <EmojiSelector onEmojiSelected={(emoji) => {
                    setMessage((prevMessage) => prevMessage + emoji)
                }} style={{ height: 300 }} />
            )}
        </KeyboardAvoidingView>
    )
}

export default ChatMessageScreen

const styles = StyleSheet.create({})