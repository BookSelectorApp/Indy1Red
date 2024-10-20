import { Text, Image, Dimensions, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get("window");

const sampleImage = 'https://via.placeholder.com/150'; //will replace with call to openlibrary api when it's back online

export default function DatesCard({ item }) {
  const [isFlipped, setIsFlipped] = useState(false);

  //toggles flipped state
  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  //dynamically updates font size; descriptions provided are insanely long, so really would like to find better descriptions but doing this for the time being
  const calculateFontSize = (text) => {
    if (text.length < 600) return 14;
    if (text.length < 900) return 12;
    if (text.length < 1400) return 10;
    return 8;
  }

  return (
    <TouchableOpacity onPress={toggleFlip}>
      {/* above is responsible for the actual flipping; below is the primary container for the animation */}
      <Animatable.View
        animation={isFlipped ? "flipInY" : "fadeIn"} //based on isflipped, use flipiny for showing details and fadein for cover; cant use flip for both because idk just doesn't work
        duration={500} //500 ms animation
        style={{
          width: width * 0.8,
          height: height * 0.65,
          borderRadius: 24,
          backfaceVisibility: 'hidden', //ensures the other side of the card isn't visible while one side is
        }}
      >
        {/* if not flipped, show cover */}
        {!isFlipped ? (
          <Animatable.View
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 24,
            }}
          >
            <Image
              source={{ uri: sampleImage }} //this will eventually be replaced with the actual cover
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 24,
              }}
              resizeMode="cover"
            />
          </Animatable.View>
        ) : (
          //if flipped, show details
          <Animatable.View
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#ADD8E6', //ugly blue but needed it for contrast
              justifyContent: 'space-between', //gets the job done for spacing each element evenly
              padding: 16,
              borderRadius: 24,
            }}
          >
            <Text className="text-xl font-bold mb-2">{item.title}</Text>
            <Text className="text-md font-semibold mb-2">By {item.author}</Text>
            <Text style={{ fontSize: calculateFontSize(item.description) }} className="mb-4">{item.description}</Text>
            <Text className="text-sm italic">Genres: {item.genres.replace(/[\[\]']/g, '')}</Text>
          </Animatable.View>
        )}
      </Animatable.View>
    </TouchableOpacity>
  );
}
