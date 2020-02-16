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
  TextInput,
  ImageBackground,
  Button,
  Dimensions
} from 'react-native';


const styles = StyleSheet.create({
  drug: {
    position: 'absolute',
    left: 85,
    top: 225,
    width: 300,
    height: 61,
    fontSize: 20,
    color: 'white'
  },
  language: {
    position: 'absolute',
    left: 85,
    top: 330,
    width: 300,
    height: 61,
    fontSize: 20,
    color: 'white'
  },
  submit: {
    position: 'absolute',
    left: 300,
    top: 630,
    width: 70,
    height: 101,
    elevation: -10
  },
  output: {
    position: 'absolute',
    left: 85,
    top: 450,
    width: 200,
    height: 61,
    fontSize: 20,
    color: 'white'
  },
  backgroundImage: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
},
});


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
const ISO6391 = require('iso-639-1')

export class ToTranslate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language: '',
      drug: '',
      data: '',
      out: ''
    }
    this.getCui = this.getCui.bind(this)
    this.getTranslation = this.getTranslation.bind(this)
  }

  handleDrug = (text) => {
    this.setState({ drug: text })
  }
  handleLanguage = (text) => {
    this.setState({ language: ISO6391.getCode(text)})
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

  async getTranslation(){
    let matchIngredient = fetch(`https://rxnav.nlm.nih.gov/REST/rxclass/class/byDrugName.json?drugName=${this.state.drug}`)
    .then(response => response.json())
    .then((responseJson) => {
      //console.log(drug + " " + language);
      let setOfIngredients = new Set();
      responseJson.rxclassDrugInfoList.rxclassDrugInfo.forEach(element => {
        setOfIngredients.add(element.minConcept.name);
      });
      const arrayOfIngredients = Array.from(setOfIngredients)
      matchIngredient = arrayOfIngredients.reduce((a, b) => a.length <= b.length ? a : b)
      if (typeof(matchIngredient) == 'undefined'){
        return this.setState({out: 'Drug does not exist!'})
      }
      console.log(`getIngredient returned: ${matchIngredient}`)
      return matchIngredient
    })
    .catch(error=>console.log(error));


    let translated =  matchIngredient.then((matchIngredient) => fetch(`https://translation.googleapis.com/language/translate/v2?key=${api_key}&q=${matchIngredient}&target=${this.state.language}`, {
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
        if (result.data.translations[0].translatedText == 'undefined'){
          return this.setState({out: 'Drug does not exist!'})
        }
        this.setState({ out: result.data.translations[0].translatedText})
        return result.data.translations[0].translatedText
    }).catch(error => console.log(error));

    return await translated;
    
  }

  render(){
    return (
      <View>
        <ImageBackground source={require('./MedLingo-07.png')} style={styles.backgroundImage}>
            <TextInput
              style={styles.drug}
              placeholder="Enter drug name"
              placeholderTextColor='white'
              onChangeText={ this.handleDrug }
            />
            <TextInput
              style={styles.language}
              placeholder="Enter language"
              placeholderTextColor='white'
              onChangeText={ this.handleLanguage }
            />
            <View style={styles.submit}>
              <Button
                title='submit'
                style = {styles.submit}
                onPress = {this.getTranslation}/>
            </View>
            <Text style = {styles.output}>{this.state.out}</Text>
          </ImageBackground>
      </View>
    );
  }
}
