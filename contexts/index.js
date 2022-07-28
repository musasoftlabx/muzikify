import React, {createContext, useEffect, useReducer, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageColors from 'react-native-image-colors';

import TrackPlayer, {
  useTrackPlayerEvents,
  usePlaybackState,
  Capability,
  State,
  Event,
} from 'react-native-track-player';

export const Context = createContext();

const reducer = (state, action) => {
  const handlePlay = (current, next) => {
    /* //get previous tracks
    const previous = playlist.slice(0, index);

    // get next tracks
    const next = playlist.slice(index + 1, playlist.length);

    const previousTracksUnfiltered = previous.filter(e => e.type === 'file');

    const previousTracks = previousTracksUnfiltered.map(e => ({
      ...e,
      url: `${state.NGINX_SERVER}dir${e.path}`,
      artwork: `${state.NGINX_SERVER}${e.coverArtURL}`,
    })); */
  };

  switch (action.type) {
    case 'PLAY':
      TrackPlayer.reset();

      const {currentTrack, nextTracks} = action.payload;

      const current = {
        ...currentTrack,
        url: `${state.NGINX_SERVER}dir${currentTrack.path}`,
        artwork: `${state.NGINX_SERVER}${currentTrack.coverArtURL}`,
      };

      const next = nextTracks.map(e => {
        return {
          ...e,
          url: `${state.NGINX_SERVER}dir${e.path}`,
          artwork: `${state.NGINX_SERVER}${e.coverArtURL}`,
        };
      });

      TrackPlayer.add(current);
      TrackPlayer.play();
      TrackPlayer.add(next);

      return {
        ...state,
        currentTrack: current,
        nextTracks: [current, next],
        isPlaying: true,
      };

    case 'PLAY_PAUSE':
      async function PlayPause() {
        const state = await TrackPlayer.getState();

        if (State.Paused === state || State.Stopped === state) {
          TrackPlayer.play();
        } else {
          TrackPlayer.pause();
        }
      }
      PlayPause();
      return {...state, isPlaying: !state.isPlaying};

    case 'STOP':
      TrackPlayer.stop();
      return {...state, ...action.payload.isPlaying};

    case 'PREVIOUS_TRACK':
      TrackPlayer.skipToPrevious();
      return {...state};

    case 'NEXT_TRACK':
      TrackPlayer.skipToNext();
      return {...state};

    case 'AUTO_NEXT':
      fetch(`${state.NODE_SERVER}UpdatePlayCount`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({_id: action.payload.track._id}),
      });

      return {
        ...state,
        ...{
          currentTrack: {
            ...action.payload.track,
            waveform: action.payload.waveform,
            plays: !action.payload.track.plays
              ? (action.payload.track.plays = 1)
              : action.payload.track.plays + 1,
          },
          gradient: [
            action.payload.colors.dominant,
            action.payload.colors.average,
            action.payload.colors.muted,
          ],
        },
      };

    case 'SEEK_TO':
      TrackPlayer.seekTo(action.position);
      return {...state};

    case 'SKIP_TO':
      async function skipTo() {
        const queue = await TrackPlayer.getQueue();
        const index = queue.findIndex(e => e._id === action.payload.track._id);
        await TrackPlayer.skip(index);
      }

      skipTo();

    case 'ADD_TO_QUEUE':
      const toQueue = {
        ...action.payload,
        url: `${state.NGINX_SERVER}dir${action.payload.path}`,
        artwork: `${state.NGINX_SERVER}${action.payload.coverArtURL}`,
      };

      TrackPlayer.add(toQueue);
      return {...state, ...{nextTracks: [...state.nextTracks, toQueue]}};

    case 'ADD_NEXT_IN_QUEUE':
      const nextInQueue = {
        ...action.payload,
        url: `${state.NGINX_SERVER}dir${action.payload.path}`,
        artwork: `${state.NGINX_SERVER}${action.payload.coverArtURL}`,
      };

      TrackPlayer.add(nextInQueue, 1);
      return {...state, ...{nextTracks: [...state.nextTracks, nextInQueue]}};

    case 'RATE':
      fetch(`${state.NODE_SERVER}rate`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _id: state.currentTrack._id,
          rating: action.rating,
        }),
      }).then(res => res.json().then(data => console.log('Updated')));
      return {
        ...state,
        ...{
          currentTrack: {
            ...state.currentTrack,
            rating: action.rating,
          },
        },
      };

    case 'SET_CURRENTLY_PLAYING':
      return {...state, currentTrack: action.payload};
    case 'ADD_TO_PLAYLIST':
      return {...state, ...{nextTracks: [...nextTracks, ...action.payload]}};
    case 'REMOVE_FROM_QUEUE':
      const {track, playBackState} = action.payload;

      async function removeFromQueue() {
        const queue = await TrackPlayer.getQueue();
        const index = queue.findIndex(e => e._id === track._id);
        await TrackPlayer.remove([index]); // Not working
        if (index !== queue.length - 1) {
          await TrackPlayer.skipToNext();
        } else {
          await TrackPlayer.stop();
        }
      }

      const activeStates = [2, 3, 6, 8];
      activeStates.includes(playBackState) && removeFromQueue();

      return {...state};

    /* return {
        ...state,
        ...{nextTracks: [...nextTracks.splice(action.payload, 1)]},
      }; */
    case 'SET_FOLDERS':
      return {...state, ...{prevs: [...state.prevs, action.payload]}};
    default:
      return state;
  }
};

const ContextProvider = ({children}) => {
  const [state, dispatch] = useReducer(
    reducer,
    {
      NODE_SERVER: 'http://musasoft.ddns.net:3000/',
      NGINX_SERVER: 'http://musasoft.ddns.net:8080/',
      gradient: ['#442fb2', '#00ffaa', '#a02008'],
      prevs: [],
    } /* , async () => {
    const store = await AsyncStorage.getItem('store');
    return store
      ? JSON.parse(store)
      : {
          NODE_SERVER: 'http://musasoft.ddns.net:3000/',
          NGINX_SERVER: 'http://musasoft.ddns.net:8080/',
        };
  } */,
  );

  useEffect(() => {
    const setUpTrackPlayer = async () => {
      try {
        await TrackPlayer.setupPlayer({
          options: {playBuffer: 0.5, minBuffer: 1},
        });
        await TrackPlayer.updateOptions({
          stopWithApp: true,
          capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
            Capability.Stop,
          ],
          compactCapabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
          ],
          notificationCapabilities: [
            TrackPlayer.CAPABILITY_PLAY,
            TrackPlayer.CAPABILITY_PAUSE,
            TrackPlayer.CAPABILITY_SEEK_TO,
            TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
            TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
          ],
        });
      } catch (e) {
        console.log(e);
      }
    };
    setUpTrackPlayer();
  }, []);

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    if (
      event.type === Event.PlaybackTrackChanged &&
      event.nextTrack !== undefined
    ) {
      const track = await TrackPlayer.getTrack(event.nextTrack);

      const colors = await ImageColors.getColors(track.artwork, {
        fallback: '#228B22',
        cache: true,
        key: Date.now(),
      });

      const waveURL = await fetch(`${state.NODE_SERVER}waveform`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: track.path,
          color: colors.vibrant,
        }),
      });
      const data = await waveURL.text();
      const waveform = `${state.NGINX_SERVER}waveforms/${data}`;

      dispatch({type: 'AUTO_NEXT', payload: {track, colors, waveform}});
      /* dispatch({
        type: 'AUTO_NEXT',
        payload: {track, colors, waveform: 'https://i.c'},
      });
      console.log('Track changed'); */

      /* const index = state.nextTracks.findIndex(
        track => track._id === state.currentlyPlaying._id,
      );
      console.log(state.nextTracks.length - index);
      if (state.nextTracks.length - index <= 2) {
        AsyncStorage.getItem('nextTracks').then(data => {
          if (data) {
            const nextTracks = JSON.parse(data);
            TrackPlayer.add(nextTracks.slice(6, 10));
            dispatch({
              type: 'ADD_TO_PLAYLIST',
              payload: nextTracks.slice(6, 10),
            });
          }
        });
      } */
    }
  });

  useTrackPlayerEvents([Event.PlaybackQueueEnded], event => {
    console.log('Queue ended');
  });

  return (
    <Context.Provider value={{state, dispatch}}>{children}</Context.Provider>
  );
};

export default ContextProvider;
