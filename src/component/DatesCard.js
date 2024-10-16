import { View, Text , Image, Dimensions} from 'react-native'
import React from 'react'

const {width, height} = Dimensions.get("window");

export default function DatesCard({ item }) {
  return (
    <View className="relative">
        <Image 
        source ={item.imgUrl} 
        style={{
            width: width* 0.8,
            height: height* 0.75,
        }}
        resizeMode="cover"
        className="rounded-3xl"    
        />
      <Text>DatesCard</Text>
    </View>
  );
}