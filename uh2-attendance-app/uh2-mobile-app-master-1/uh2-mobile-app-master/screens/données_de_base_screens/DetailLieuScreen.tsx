import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Header from "../../components/Header";
import Button from '../../components/Button';
import Frame from '../Frame';
type Props = {
    route: {
        params: {
            Lieu: {
                name: string;
                building_name: string;
                classroom_number: string;
                capacity: number;
            };
        };
    };
};

const DetailLieuScreen = ({ route }: Props) => {
    const { Lieu } = route.params;

    return (
        <View style={styles.Background}>
            {/* <Header >{Lieu?.name || '--'}</Header> */}
            <Frame title={Lieu?.name || '--'}>
            <Text  style={styles.info}>Building name:</Text>
            <Button mode='contained-tonal'>
            <Text  style={styles.info}>{Lieu?.building_name || '--'}</Text>
            </Button>
            <Text  style={styles.info}>Classroom number :</Text>
            <Button mode='contained-tonal'>
            <Text  style={styles.info}>{Lieu?.classroom_number || '--'}</Text>
            </Button>
            <Text  style={styles.info}>Capacity :</Text>
            <Button  mode='contained-tonal' >
            <Text  style={styles.info}>{Lieu?.capacity || '--'}</Text>
            </Button>
            </Frame>
        </View>
    );

};
const styles = StyleSheet.create({
    Background:{
        flex: 1, padding: 20,
        zIndex: 1,
        width: '100%',
        opacity: 1,
        maxWidth: 340,
        alignSelf: 'center',
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    info:{
        fontSize: 12, 
        marginBottom: 2, 
        margin:20
    }
});
export default DetailLieuScreen;
