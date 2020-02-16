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
const { Translate } = require('@google-cloud/translate').v2;

// Creates a client
const translate = new Translate();

// import {
//   Header,
//   LearnMoreLinks,
//   Colors,
//   DebugInstructions,
//   ReloadInstructions,
// } from 'react-native/Libraries/NewAppScreen';

const url = 'https://rxnav.nlm.nih.gov/REST/';

export class ToTranslate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: ''
    }
    this.getCui = this.getCui.bind(this)
    this.getTranslatedIngredient = this.getTranslatedIngredient.bind(this)
  }

  //add in approx
  //give other brands with same ingredient
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

  getIngredient(name){
    let matchIngredient = ''
    fetch(`https://rxnav.nlm.nih.gov/REST/rxclass/class/byDrugName.json?drugName=${name}`)
      .then(response => response.json())
      .then((responseJson)=> {
        // console.log(responseJson);
        let setOfIngredients = new Set();
        responseJson.rxclassDrugInfoList.rxclassDrugInfo.forEach(element => {
          setOfIngredients.add(element.minConcept.name);
        });
        const arrayOfIngredients = Array.from(setOfIngredients)
        matchIngredient = arrayOfIngredients.reduce((a, b) => a.length <= b.length ? a : b)
        console.log(`getIngredient returned: ${matchIngredient}`)
      })
      .catch(error=>console.log(error));
      
      return matchIngredient;
    }

  async getTranslation(name, language){
    console.log('i am google. translator at your service.')
    const [translations] = await translate.translate(name, language);
    translations = Array.isArray(translations) ? translations : [translations];
    // console.log('Translations:');
    // translations.forEach((translation, i) => {
    //   console.log(`${text[i]} => (${target}) ${translation}`);
    // });
    // console.log(`here is the translation: ${translation}`)
    return
  }

  getTranslatedIngredient(name){
    console.log('i am google. translator at your service.')
    const translatedIngredients = this.getTranslation(this.getIngredient(name), 'ru');
    return translatedIngredients
  }
  
  render(){
    return (
      <View style={{padding: 10}}>
        <TextInput
          style={{height: 40}}
          placeholder="Enter the medication"
          onChangeText={ this.getTranslatedIngredient }
        />
      </View>
    );
  }
}
