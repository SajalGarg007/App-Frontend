import * as React from 'react';
import { ScrollView } from 'react-native';
import { Dialog, Portal, Text, Button, Provider } from 'react-native-paper';
const getPercentageWidth = (percentage, dimension) => {
	return Math.round((percentage / 100) * dimension);
};

const Notify = ({ visible, text, hideDialog,width }) => {
  const isDesktop = width >= 768;
  return (
    <Portal >
    <Dialog visible={visible} onDismiss={hideDialog} style={{width:isDesktop?(getPercentageWidth(30,width)):(getPercentageWidth(90,width)),
       justifyContent:'center', marginHorizontal: isDesktop?(getPercentageWidth(37,width)):(getPercentageWidth(5,width))}}>
      <Dialog.ScrollArea>
        <ScrollView contentContainerStyle={{paddingHorizontal: 24}}>
          {console.log("consoling width",width)}
          <Text>{text}</Text>
        </ScrollView>
      </Dialog.ScrollArea>
      <Dialog.Actions>
        <Button onPress={hideDialog}>OK</Button>
      </Dialog.Actions>
    </Dialog>
  </Portal>
   
  );
};

export default Notify;