import React, {useState, useEffect} from 'react';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Dimensions,
  Image,
  View,
  Text,
  StyleSheet,
  BackHandler,
  Alert,
  Button,
} from 'react-native';
import Coverflow from 'react-native-coverflow';
//import Carousel from 'react-native-snap-carousel';
import Slider from '@react-native-community/slider';
//import {Rating} from 'react-native-ratings';
import SwipeableRating from 'react-native-swipeable-rating';
import LinearGradient from 'react-native-linear-gradient';
import {colorsFromUrl} from 'react-native-vibrant-color';

import {
  Avatar,
  BottomNavigation,
  Card,
  Title,
  Headline,
  Paragraph,
  RadioButton,
  IconButton,
  List,
  FAB,
  Chip,
  Divider,
  useTheme,
} from 'react-native-paper';

const songs = [
  {
    url: 'http://musasoft.ddns.net:8080/images/covers/01___Ski_Mask_The_Slump_God_ft_Offset___HipHopTXLcom__i0LNO.jpg',
    song: 'http://musasoft.ddns.net:8080/dir/Uganda/Spice Diana/Obisaana.mp3',
  },
  {
    url: 'http://musasoft.ddns.net:8080/images/covers/25___Ty_Dolla_ign_x_Babyface__EHifH.jpg',
    song: 'http://musasoft.ddns.net:8080/dir/Uganda/Spice Diana/Nsitula.mp3',
  },
  {
    url: 'http://musasoft.ddns.net:8080/images/covers/26___Bobby_Shmurda_ft_Fabolous_Jadakiss_Chris_Brown_Busta_Rhymes_Rowdy_Rebel_Yo_Gotti___Hot_Nigga__R__DatPiff_Exclusive___4KAi0.jpg',
    song: 'http://musasoft.ddns.net:8080/dir/Uganda/Spice Diana/Obisaana.mp3',
  },
];

const DATA = [];
for (let i = 0; i < 10; i++) {
  DATA.push(i);
}

const NowPlaying = ({
  currentlyPlaying,
  handlePlayPause,
  handleNext,
  isPlaying,
  handlePlay,
  playerScreen,
  setPlayerScreen,
  playlist,
  TrackPlayer,
}) => {
  const [rating, setRating] = useState(0);
  const [gradient, setGradient] = useState(['#000', '#fff']);

  useEffect(() => {
    const backAction = () => {
      Alert.alert('Hold on!', 'Are you sure you want to go back?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {text: 'YES', onPress: () => BackHandler.exitApp()},
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const handleBackroundColor = i => {
    colorsFromUrl(playlist[i].artwork).then(colors => {
      setGradient([colors.vibrantColor, colors.dominantColor]);
      //gradient = [colors.vibrantColor, colors.dominantColor];
      //gradient.current = [colors.vibrantColor, colors.dominantColor];
    });
  };

  const handleRating = rating => console.log(rating);

  const CarouselCardItem = ({item, i}) => {
    return (
      <View style={styles.itemContainer} key={i}>
        <Image
          source={{
            uri: 'http://musasoft.ddns.net:8080/images/covers/01___Ski_Mask_The_Slump_God_ft_Offset___HipHopTXLcom__i0LNO.jpg',
          }}
          style={{
            height: 300,
            width: 300,
          }}
        />
      </View>
    );
  };

  const sliderWidth = Dimensions.get('window').width;
  const itemWidth = Math.round(sliderWidth * 0.7);

  return (
    <View>
      <Modal
        isVisible={playerScreen}
        //onBackdropPress={() => setPlayerScreen(false)}
      >
        {/* <Carousel
          data={DATA}
          renderItem={CarouselCardItem}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          layout="stack"
          layoutCardOffset={18}
          inactiveSlideShift={0}
          onSnapToItem={index => console.log(index)}
          useScrollView={true}
        /> */}
        <LinearGradient colors={gradient}>
          <View style={styles.cover}>
            <Button title="Close" onPress={() => setPlayerScreen(false)} />
            <Coverflow
              width="100%"
              style={{height: 400}}
              spacing={250}
              wingSpan={80}
              onChange={i => handleBackroundColor(i)}>
              {playlist.length > 0 ? (
                playlist.map((track, i) => (
                  <View key={i}>
                    <Image
                      source={{
                        uri: track.artwork,
                      }}
                      style={{
                        height: Dimensions.get('window').width - 50,
                        width: Dimensions.get('window').width - 50,
                      }}
                    />
                  </View>
                ))
              ) : (
                <View></View>
              )}
            </Coverflow>

            <View style={styles.container}>
              <Slider
                style={{width: Dimensions.get('window').width - 50, height: 40}}
                minimumValue={0}
                maximumValue={1}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="#000000"
              />
              <Text style={styles.artists}>
                {(currentlyPlaying?.artists &&
                  currentlyPlaying.artists.join(' / ')) ||
                  ''}
              </Text>
              <Text style={styles.title}>
                {(currentlyPlaying?.title && currentlyPlaying.title) || ''}
              </Text>
              <Text style={styles.album}>
                {(currentlyPlaying?.album && currentlyPlaying.album) || ''}
              </Text>
              {/* <Rating
            defaultRating={3.5}
            type="heart"
            showRating={true}
            imageSize={15}
            onFinishRating={rating => console.log(rating)}
          /> */}
              <SwipeableRating
                style={styles.rating}
                rating={rating}
                size={28}
                gap={4}
                onPress={r => setRating(r)}
                minRating={0.5}
                allowHalves={true}
                swipeable={true}
                xOffset={100}
                color={'#FFD700'}
                emptyColor={'#FFD700'}
              />
              <View style={styles.metadata}>
                <Text>MP3 320Kbps</Text>
              </View>
              <View style={styles.controls}>
                <IconButton
                  color="white"
                  size={70}
                  icon="skip-previous-circle"
                  onPress={handlePlay}
                />
                <IconButton
                  color="white"
                  size={100}
                  icon="play-circle"
                  onPress={handlePlay}
                />
                <IconButton
                  color="white"
                  size={70}
                  icon="skip-next-circle"
                  onPress={handlePlay}
                />
              </View>
            </View>
          </View>
        </LinearGradient>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'dodgerblue',
  },
  cover: {
    //backgroundColor: 'grey',
    //height: Dimensions.get('window').height,
  },
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    //justifyContent: 'center',
  },
  artists: {
    fontSize: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 5,
    marginBottom: 8,
  },
  album: {
    fontSize: 18,
    fontWeight: '500',
  },
  rating: {
    //marginTop: 50,
    marginBottom: 20,
  },
  metadata: {
    backgroundColor: 'grey',
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

export default NowPlaying;
