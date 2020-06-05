import React from "react"
import {View, Image, TouchableOpacity, StyleSheet, Text, SafeAreaView} from "react-native"
import {Feather as Icon, FontAwesome} from "@expo/vector-icons"
import {RectButton } from "react-native-gesture-handler"
import {useNavigation} from "@react-navigation/native"


const Detail = () => {
  const navigation = useNavigation()
  function handleNavigateBack() {
    navigation.goBack()
  }
  return (
      <SafeAreaView style={{flex:1}}> 
    <View style={styles.container}>
      <TouchableOpacity onPress={handleNavigateBack}>
      <Icon name="arrow-left" color="#34cb79" size={24}> </Icon>

      </TouchableOpacity>
      <Image  style={styles.pointImage} source={{
                uri: "data:image/png;base64,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"
    }}></Image>

    <Text style={styles.pointName}>MERCADAO DO ADRIANO</Text>
    <Text style={styles.pointItems}>MLMAPADAANO</Text>
    <Text style={styles.pointItems}>MERTESTEANO</Text>

    <View style={styles.address}>
    <Text style={styles.addressTitle}>endreco</Text>
    <Text style={styles.addressContent}>cidade</Text>
    </View>

    </View>

    <View style={styles.footer}>
      <RectButton style={styles.button} onPress={() => {}}>
          <FontAwesome name="whatsapp" size={20} color="#FFF"></FontAwesome>
          <Text style={styles.buttonText}>Whatsapp</Text>


      </RectButton>

      <RectButton style={styles.button} onPress={() => {}}>
          <Icon name="mail" size={20} color="#FFF"></Icon>
          <Text style={styles.buttonText}>E-mail</Text>


      </RectButton>


    </View>

    </SafeAreaView>
)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    paddingTop: 20
  },

  pointImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
    borderRadius: 10,
    marginTop: 32,
  },

  pointName: {
    color: '#322153',
    fontSize: 28,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  pointItems: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  address: {
    marginTop: 32,
  },
  
  addressTitle: {
    color: '#322153',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },

  addressContent: {
    fontFamily: 'Roboto_400Regular',
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#999',
    paddingVertical: 20,
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  
  button: {
    
    width: '48%',
    backgroundColor: '#34CB79',
    borderRadius: 10,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    marginLeft: 8,
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
  },
});

export default Detail