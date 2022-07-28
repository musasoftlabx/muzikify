import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  Text,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';

const Star = ({
  hasOnPress,
  filled,
  size,
  half,
  onPress,
  gap,
  n,
  color,
  emptyColor,
  filledIcon,
  halfFilledIcon,
  emptyIcon,
}) => <Text>wef</Text>; /* (
  <TouchableOpacity disabled={!hasOnPress} onPress={() => onPress(n)}>
    {typeof filledIcon === 'string' ? (
      <Icon
        style={{
          color: filled ? color : emptyColor,
          marginRight: gap,
        }}
        name={filled ? (half ? halfFilledIcon : filledIcon) : emptyIcon}
        size={size}
      />
    ) : filled ? (
      half ? (
        halfFilledIcon(size, gap, color, emptyColor, n)
      ) : (
        filledIcon(size, gap, color, emptyColor, n)
      )
    ) : (
      emptyIcon(size, gap, color, emptyColor, n)
    )}
  </TouchableOpacity>
); */

const onPress = () => {};

const hasOnPress = () => {};

const SwipeableRating = () => {
  const [defaults, setDefaults] = useState({
    swipeable: true,
    color: 'crimson',
    emptyColor: 'crimson',
    size: 24,
    gap: 0,
    xOffset: 0,
    minRating: 1,
    maxRating: 5,
    allowHalves: false,
    filledIcon: 'star',
    halfFilledIcon: 'star-half',
    emptyIcon: 'star-border',
  });

  const {rating, maxRating, allowHalves, ...rest} = defaults;

  return (
    <View style={styles.container}>
      {Array(defaults.maxRating)
        .fill()
        .map((_, n) => (
          <Star
            key={n}
            n={n + 1}
            onPress={onPress}
            hasOnPress={hasOnPress}
            filled={rating > n}
            half={allowHalves && rating > n && rating < n + 1}
            {...rest}
          />
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});

Star.propTypes = {
  hasOnPress: PropTypes.bool,
  filled: PropTypes.bool,
  size: PropTypes.number,
  half: PropTypes.bool,
  onPress: PropTypes.func,
  gap: PropTypes.number,
  n: PropTypes.number.isRequired,
  color: PropTypes.string,
  emptyColor: PropTypes.string,
  filledIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  halfFilledIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  emptyIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
};

export default SwipeableRating;
