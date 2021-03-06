import * as React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, FlatList, ScrollView} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons'
import {LinearGradient} from 'expo-linear-gradient';
import {Video} from 'expo-av';

import CustomHeader from '../components/Header'
import CustomBottomTab from '../components/BottomTab'

const data = [
  {
    address: "Buffalo, New York",
    image: "https://activist-armor.nyc3.cdn.digitaloceanspaces.com/a285e2bb-a79f-488a-baa4-7bafa80fae96.mp4",
    id: 1,
  },
  {
    address: "London, UK",
    image: "https://i.redd.it/cqxp2xypqo941.jpg",
    id: 2,
  }
]

export default class FeedScreen extends React.Component{

  state = {
    data: []
  }

  componentDidMount(){
  }
  
  receiveData = () => {
    fetch('http://68.56.112.110/api/feed', {
      method: 'GET'
    }).then(res => res.json()).then(res => {
      this.setState({ data: res })
    }).then(() => this.setState({ loaded: true }))
    console.log(this.state.data)
  }

  render(){
    this.receiveData()
    return (
      <LinearGradient colors={['#2193b0', '#6dd5ed']} 
        style={styles.container}>
        <CustomHeader nav={this.props.navigation} title={"Feed"}/>
        { 
          this.state.loaded && (
            <ScrollView
              data={this.state.data}
              keyExtractor={item => item.id}
              style={styles.listContainer}
            >
              {this.state.data.map((item, key) => ( 
                <Post postData={item} key={key} />
              ))}
            </ScrollView>
          )
        }
        <CustomBottomTab nav={this.props.navigation}/>
      </LinearGradient>
    );
  }
}

function Post(input){
  return(
    <View style={styles.post}>
      <View style={styles.row}>
        <Text style={styles.postLocation}>{input.postData.address}</Text>
        <TouchableOpacity style={{paddingRight: 5}}>
          <MaterialCommunityIcons name={'dots-horizontal'} size={30}/>
        </TouchableOpacity>
      </View>
      {
        input.postData.image.includes(".jpg") || input.postData.image.includes(".png") ?
      <Image source={{uri: input.postData.image}} style={styles.postImage}/> 
      :
      <Video
        source={{uri: "https://activist-armor.nyc3.cdn.digitaloceanspaces.com/a285e2bb-a79f-488a-baa4-7bafa80fae96.mp4"}}
        style={styles.postImage}
        rate={1.0}
        volume={1.0}
        isMuted={true}
        resizeMode="cover"
        shouldPlay
        isLooping
      />
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  post: {
    backgroundColor: 'white',
    borderWidth: 0,
    borderRadius: 10,
    borderColor: '#e0e0e0',
    flex: 1,
    elevation: 5,
    paddingTop: 10,
    marginBottom: 10,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  postLocation: {
    paddingBottom: 5,
    paddingHorizontal: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },
  postImage: {
    width: '100%',
    height: 200,
  },
});

/*
GET request to https://activistarmor.online/api/feed
Expected Response: 
{
  {
  'url': "https://activist-armor.nyc3.cdn.digitalocean.com/asdhka.mp4",
  'timestamp': '14:34:15 UTC 06/06/2020',
  'longitude': "34.324 N",
  'latitude': "87.3242 W"
  },
  {
  (the same sort of body will repeat with different data and give you exactly 10 of the most recent posts in that format)
  }
}
*/