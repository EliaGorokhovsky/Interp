import 'react-native-gesture-handler';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import changeNavigationBarColor, {
  HideNavigationBar,
  ShowNavigationBar,
} from 'react-native-navigation-bar-color';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Button,
  View,
  Text,
  StatusBar,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Dimensions
} from 'react-native';

import { Component } from 'react';
import { ToTranslate } from './components/Translate';

const Stack = createStackNavigator()

const styles = StyleSheet.create({
  searchButton: {
    position: 'absolute',
    left: 20,
    top: 260,
    width: 320,
    height: 61,
    elevation: -10
  },
  mapButton: {
    position: 'absolute',
    left: 55,
    top: 340,
    width: 300,
    height: 61,
    elevation: -10
  },
  discoverButton: {
    position: 'absolute',
    left: 55,
    top: 440,
    width: 300,
    height: 61,
    elevation: -10
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 620,
    width: 100,
    height: 200,
    elevation: -10
  }
});

function HomeScreen({ navigation } ) {
  //style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
  return (
    <View>
      <ImageBackground source={require('./MedLingo-06.png')} style={{width: '100%', height: '100%'}}/>
      <View style={styles.searchButton}>
        <Button
          title="Search"
          color='transparent'
          onPress={() => navigation.navigate('Search')}/>
      </View>
      
      <View style={styles.mapButton}>
        <Button
          title="Map"
          color='transparent'
          onPress={() => navigation.navigate('Map')}
        />
      </View>

      <View style={styles.discoverButton}>
        <Button
          title="Discover"
          color='transparent'
          onPress={() => navigation.navigate('Discover')}
        />
        </View>
    </View>
  );
}

function SearchScreen({ navigation }) {
  return (
    <View>
      <ToTranslate/>
      <View style={styles.backButton}>
       <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
     </View>
    </View>
  );
}

function MapScreen({ navigation }) {
  return (
    <View>
      <ImageBackground source={require('./MedLingo-12.png')} style={{width: '100%', height: '100%'}}/>
      <Text>Map</Text>
      <View style={styles.backButton}>
        <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
      </View>
    </View>
  );
}

function DiscoverScreen({ navigation }) {
  return (
    <View>
      <ImageBackground source={require('./MedLingo-11.png')} style={{width: '100%', height: '100%'}}/>
      <Text>Discover</Text>
      <View style={styles.backButton}>
        <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
      </View>
    </View>
  );
}

function ProfileScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <View style={styles.backButton}>
        <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
      </View>
      <ToTranslate/>
    </View>
  );
}

function FavoriteScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <View style={styles.backButton}>
        <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
      </View>
    </View>
  );
}

function HistoryScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <View style={styles.backButton}>
        <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
      </View>
    </View>
  );
}

export default class App extends Component{
  static navigationOptions = {
    //To hide the NavigationBar from current Screen
    header: null
  };

  render(){
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{
          headerShown: false
        }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Search" component={SearchScreen} />
          <Stack.Screen name="Map" component={MapScreen} />
          <Stack.Screen name="Discover" component={DiscoverScreen} />
          <Stack.Screen name="Favorite" component={FavoriteScreen} />
          <Stack.Screen name="History" component={HistoryScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}