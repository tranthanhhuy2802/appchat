import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { UserType } from '../navigation/UserContext';
import axios from 'axios';
import FriendRequest from '../components/FriendRequest';

const FriendsScreen = () => {
    const { userId, setUserId } = useContext(UserType);
    const [friendRequest, setFriendRequest] = useState()
    useEffect(() => {
        const fetchFriendRequest = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/friend-req/${userId}`);
                if (response.status === 200) {
                    const freindRequestData = response.data.map((friendRequest) => ({
                        _id: friendRequest._id,
                        name: friendRequest.name,
                        email: friendRequest.email,
                        image: friendRequest.image,

                    }))
                    setFriendRequest(freindRequestData)
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchFriendRequest();
    }, []);
    console.log(friendRequest)
    return (
        <View style={{ padding: 10 }}>
            {friendRequest && friendRequest.length > 0 && <Text>Your Friend Request</Text>}
            {
                friendRequest?.map((item, index) => {
                    return (

                        <FriendRequest key={index} item={item} friendRequest={friendRequest} setFriendRequest={setFriendRequest} />
                    )
                })
            }
        </View>
    )
}

export default FriendsScreen

const styles = StyleSheet.create({})