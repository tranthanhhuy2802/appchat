import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import StackNavigator from './src/navigation/StackNavigator'
import { UserContext } from './src/navigation/UserContext'

const App = () => {
  return (
   <>
   <UserContext>
   <StackNavigator/>
   </UserContext>
   </>
  )
}

export default App

const styles = StyleSheet.create({})