import React, {useContext} from 'react';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Slider from '@react-native-community/slider';
import LinearGradient from 'react-native-linear-gradient';

import {usePlaybackState, useProgress} from 'react-native-track-player';

import {Context} from '../contexts';

import {
  Dimensions,
  View,
  StyleSheet,
  Image,
  Text,
  Pressable,
} from 'react-native';

const Footer = () => {
  const {position, duration} = useProgress();
  const playBackState = usePlaybackState();
  //useTrackPlayerEvents([Event.PlaybackState], event => {
  // if (event.type === TrackPlayerEvents.PLAYBACK_ERROR) {
  //   console.warn('An error occured while playing the current track.');
  // }
  /* if (event.state === State.Playing) {
      setPlayerState('PLAYING');
    } else if (event.state === State.Paused) {
      setPlayerState('PAUSED');
    } else if (event.state === State.Stopped) {
      setPlayerState('STOPPED');
    } else if (event.state === State.Ready) {
      setPlayerState('READY');
    } else if (event.state === State.Connecting) {
      setPlayerState('CONNECTING');
    } else if (event.state === State.Buffering) {
      setPlayerState('BUFFERING');
    } else if (event.state === State.None) {
      setPlayerState('NONE');
    } */
  //});

  const navigation = useNavigation();

  const {state, dispatch, playerState} = useContext(Context);

  const activeStates = [2, 3, 6, 8];

  return (
    <>
      {activeStates.includes(playBackState) && (
        <View
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            width: '100%',
            zIndex: 1000,
          }}>
          {state.gradient.length > 0 && (
            <LinearGradient
              colors={[state.gradient[0], state.gradient[1]]}
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                opacity: 0.7,
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
              }}
            />
          )}
          <Slider
            style={{
              width: '100%',
              marginTop: -10,
              marginBottom: -10,
              marginLeft: -20,
            }}
            value={Math.floor((position / duration) * 100) || 0}
            thumbTintColor="transparent"
            onValueChange={value => {
              dispatch({
                type: 'SEEK_TO',
                position: (value / 100) * duration,
              });
            }}
            minimumValue={0}
            maximumValue={100}
            minimumTrackTintColor={state.gradient[0] || '#FFF'}
            maximumTrackTintColor="#FFFFFF"
          />
          <Pressable onPress={() => navigation.navigate('NowPlaying')}>
            <View
              style={{
                flexDirection: 'row',
                paddingVertical: 10,
                paddingHorizontal: 20,
              }}>
              <Image
                source={{
                  uri: state.currentTrack?.artwork,
                }}
                style={{
                  height: 45,
                  width: 45,
                  marginRight: 8,
                  borderRadius: 10,
                }}
              />
              <View
                style={{
                  justifyContent: 'center',
                  marginTop: -2,
                  maxWidth: Dimensions.get('window').width - 175,
                }}>
                <Text numberOfLines={1} style={styles.title}>
                  {state.currentTrack?.title || state.currentTrack?.name}
                </Text>
                <Text numberOfLines={1} style={styles.artists}>
                  {(state.currentTrack &&
                    state.currentTrack.artists.join(' / ')) ||
                    'Unknown Artist'}
                </Text>
                <Text numberOfLines={1} style={styles.album}>
                  {state.currentTrack?.album || 'Unknown Album'}
                </Text>
              </View>
              <View style={{flex: 1}} />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Pressable
                  onPress={() => dispatch({type: 'PLAY_PAUSE'})}
                  style={{marginRight: 30}}>
                  <Icon
                    name={playBackState === 3 ? 'pause-circle' : 'play-circle'}
                    size={45}
                  />
                </Pressable>
                <Pressable onPress={() => dispatch({type: 'NEXT_TRACK'})}>
                  <Icon name="play-forward" size={25} />
                </Pressable>
              </View>
            </View>
          </Pressable>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 17,
    fontWeight: '600',
  },
  artists: {
    fontSize: 14,
    fontWeight: '300',
    fontStyle: 'italic',
  },
  album: {
    fontSize: 12,
    fontWeight: '300',
  },
  plays: {
    backgroundColor: 'grey',
    borderRadius: 10,
    height: 35,
    margin: 10,
    opacity: 0.6,
    padding: 5,
    paddingHorizontal: 15,
    backgroundColor: '#000',
  },
});

export default Footer;
