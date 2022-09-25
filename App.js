import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

const firebase = require('firebase');
require('firebase/firestore');
const list1 = firebase.firestore().collection('shoppinglists').doc('list1');
// or firebase.firestore().collection('shoppinglists/list1');

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      lists: [],
    };
    const firebaseConfig = {
      apiKey: 'AIzaSyDZx1WRlCV1lsSIJ5J9vTAqRe4hCiWRfe8',
      authDomain: 'test-4595a.firebaseapp.com',
      projectId: 'test-4595a',
      storageBucket: 'test-4595a.appspot.com',
      messagingSenderId: '375148346004',
      appId: '1:375148346004:web:cd91fafaa0e039050dd281',
      measurementId: 'G-8RG2MBX8VG',
    };
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
  }

  componentDidMount() {
    this.referenceShoppingLists = firebase
      .firestore()
      .collection('shoppinglists');
    this.unsubscribe = this.referenceShoppingLists.onSnapshot(
      this.onCollectionUpdate
    );
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async user => {
      if (!user) {
        await firebase.auth().signInAnonymously();
      }

      //update user state with currently active user data
      this.setState({
        uid: user.uid,
        loggedInText: 'Hello there',
      });
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onCollectionUpdate = querySnapshot => {
    const lists = [];
    // go through each document
    querySnapshot.forEach(doc => {
      // get the QueryDocumentSnapshot's data
      var data = doc.data();
      lists.push({
        name: data.name,
        items: data.items.toString(),
      });
    });
    this.setState({
      lists,
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <StatusBar style="auto" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
