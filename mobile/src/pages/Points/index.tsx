import React, {useState, useEffect} from "react"
import  Constants  from "expo-constants"
import {View, SafeAreaView, Image, StyleSheet, Text, TouchableOpacity, ScrollView ,Alert,} from "react-native"
import {useNavigation} from "@react-navigation/native"
import {Feather as Icon} from "@expo/vector-icons"
import MapView,{Marker} from "react-native-maps"
import { SvgUri} from "react-native-svg"
import * as Location from "expo-location"

import api from "../../services/api"


interface Item {
  id:number;
  title: string;
  image_url:string
}

interface Points {
  id:number;
  image: string;
  name:string;
  latitude: number;
  longitude:number;

}
const Points = () => {
  const [items,setItems] = useState<Item[]>([])

  const [points,setPoints] = useState<Points[]>([])

  const [ selectedItems,setSelectedItem] = useState<number[]>([])
  const navigation = useNavigation()
  const [initialPosition, setInitialPosition] = useState<[number,number]>([0,0])
  function handleNavigateBack() {
    navigation.goBack()
  }
  function handleNavigateToDetail(id:number) {
    navigation.navigate("Detail",{
      point_id: id
    })

  }

  function handleSelectItem(id :number) {
    const findIndex = selectedItems.findIndex(item => item === id)
  
    if(findIndex >=0 ) {
      const filteredItens = selectedItems.filter(item => item !== id)
      setSelectedItem(filteredItens)
      
    } else {
      setSelectedItem([...selectedItems,id])
  
    }
  
   }

  useEffect(() => {
  
    async function loadItems() {
      try {
        const response = await api.get("items")
        setItems(response.data)
      } catch(err) {
        console.log(err)
      }  
    }
    loadItems()

  },[])

  useEffect(() => {
  
    async function loadPosition() {
      try {

        const {status} = await Location.requestPermissionsAsync()
        if(status !== "granted") {
          Alert.alert("Ooops","precisamos da sua permissão para obter a localização")
          return;
           
        }

        const location = await Location.getCurrentPositionAsync()
        const { latitude,longitude} = location.coords

        setInitialPosition([latitude,longitude])


      } catch(err) {
        console.log(err)
      }  
    }

    loadPosition()

  },[])

  useEffect(() => {
  
    async function loadPoints() {
      try {
        const response = await api.get("points", {
          params: {
            city:"Rio de janeiro",
            uf:"RJ",
            items: [1,2,3,4,5,6]
          }
        })
        setPoints(response.data)


      } catch(err) {
        console.log(err)
      }  
    }

    loadPoints()

  },[])


  
  return (
    <SafeAreaView style={{flex:1}}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateBack}>
        <Icon name="arrow-left" color="#34cb79" size={24}> </Icon>

        </TouchableOpacity>

        <Text style={styles.title}>Bem vindo.</Text>
        <Text style={styles.description}>Encontre no mapa um ponto de coleta.</Text>

        <View style={styles.mapContainer}>
            { initialPosition[0] !== 0 && (           <MapView style={styles.map} initialRegion={{
            latitude:initialPosition[0],
            longitude:initialPosition[1],
            latitudeDelta:0.014,
            longitudeDelta: 0.014,
          }}
            loadingEnabled={initialPosition[0] === 0 }
          >
              {points.map(point => (
                              <Marker key={String(point.id)} style={styles.mapMarker} coordinate={{
                                latitude:point.latitude,
                                longitude:point.longitude,
                        
                              }}
                                onPress={() => handleNavigateToDetail(point.id)}
                              >
                                <View style={styles.mapMarkerContainer}>
                                <Image style={styles.mapMarkerImage} source={{
                                    uri: "http://192.168.15.13:3333/uploads/lampadas.svg"
                                  }}></Image>
                                  <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                                </View>
                    
                                  </Marker>)
              )}

          </MapView>)}
        </View>
      </View>
      <View style={styles.itemsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal:20}}
          
        >

              {items.map(item => (   
                
                <TouchableOpacity activeOpacity={0.7} key={String(item.id)}style={[styles.item,selectedItems.includes(item.id) && styles.selectedItem ]} onPress={() => {handleSelectItem(item.id)}}>
              <SvgUri width={42} height={42} uri={item.image_url}></SvgUri>
              <Text style={styles.itemTitle}>{item.title}</Text>

            
          </TouchableOpacity>))}
          </ScrollView>

      </View>
      </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20 ,
  },

  title: {
    fontSize: 20,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 4,
    fontFamily: 'Roboto_400Regular',
  },

  mapContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 16,
  },

  map: {
    width: '100%',
    height: '100%',
  },

  mapMarker: {
    width: 90,
    height: 80, 
  },

  mapMarkerContainer: {
    width: 90,
    height: 70,
    backgroundColor: '#34CB79',
    flexDirection: 'column',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center'
  },

  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: 'cover',
  },

  mapMarkerTitle: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    color: '#FFF',
    fontSize: 13,
    lineHeight: 23,
  },

  itemsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 32,
  },

  item: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#eee',
    height: 120,
    width: 120,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'space-between',

    textAlign: 'center',
  },

  selectedItem: {
    borderColor: '#34CB79',
    borderWidth: 2,
  },

  itemTitle: {
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    fontSize: 13,
  },
});

export default Points