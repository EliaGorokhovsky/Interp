import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  TextInput
} from 'react-native';



// Imports the Google Cloud client library
//const { Translate } = require('@google-cloud/translate').v2;

// Creates a client
//const translate = new Translate();

// import {
//   Header,
//   LearnMoreLinks,
//   Colors,
//   DebugInstructions,
//   ReloadInstructions,
// } from 'react-native/Libraries/NewAppScreen';

const url = 'https://rxnav.nlm.nih.gov/REST/';
const api_key = 'AIzaSyDRzRq1ISVJf3IuLoiLnXmOfhFh6FVAusM'

export class ToTranslate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: '',
      language: ''
    }
    this.getCui = this.getCui.bind(this)
    this.getYandexTranslation = this.getYandexTranslation.bind(this)
  }

  getCui(text){
    fetch(`https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${text}&search=1`)
      .then(response => response.json())
      .then((responseJson)=> {
        this.setState({
          data: responseJson.idGroup.rxnormId[0]
        })
        console.log(this.state.data)
      })
      .catch(error=>console.log(error)) //to catch the errors if any

      return this.state.data
  }

  async getYandexTranslation(name){
    let matchIngredient = fetch(`https://rxnav.nlm.nih.gov/REST/rxclass/class/byDrugName.json?drugName=${name}`)
    .then(response => response.json())
    .then((responseJson) => {
      //console.log('responseJson: ', responseJson);
      let setOfIngredients = new Set();
      responseJson.rxclassDrugInfoList.rxclassDrugInfo.forEach(element => {
        setOfIngredients.add(element.minConcept.name);
      });
      const arrayOfIngredients = Array.from(setOfIngredients)
      matchIngredient = arrayOfIngredients.reduce((a, b) => a.length <= b.length ? a : b)
      console.log(`getIngredient returned: ${matchIngredient}`)
      return matchIngredient
    })
    .catch(error=>console.log(error));

    let translated =  matchIngredient.then((matchIngredient) => fetch(`https://translation.googleapis.com/language/translate/v2?key=${api_key}&q=${matchIngredient}&target=ru`, {
      method: 'POST',
      headers: {
        Accept: 'application/json', 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
       // q: matchIngredient,
        //target: 'ru'
        key: 'AIzaSyDRzRq1ISVJf3IuLoiLnXmOfhFh6FVAusM'
      })
    })).then(result => result.json())
      .then((result) => {
        console.log(result.data.translations[0].translatedText)
        return result.data.translations[0].translatedText
    }).catch(error => console.log(error));

    return await translated;
    
  }
  
  render(){
    return (
      <View style={{padding: 10}}>
        <TextInput
          style={{height: 40}}
          placeholder="Enter the medication"
          onChangeText={ this.getYandexTranslation }
        />
        {/* <Button
          onPress= {this.getYandexTranslation }
        /> */}
      </View>
    );
  }
}
