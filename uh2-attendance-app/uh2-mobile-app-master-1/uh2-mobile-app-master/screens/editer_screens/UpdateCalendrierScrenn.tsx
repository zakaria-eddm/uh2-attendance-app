import React, { memo, useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView ,Alert} from 'react-native';
import TextInput from '../../components/TextInput';
import Button from '../../components/Button';
import { useRoute, useNavigation } from '@react-navigation/native';
import api from '../../ApiService';
import { Navigation } from "../../types";
import { Calendrier } from "../admin_screens/CalendrierScreen";
import { AuthContext } from '../../AuthContext';
import RNPickerSelect from "react-native-picker-select";
import Frame from '../Frame';
type Props = {
    navigation: Navigation;
};
type Props1 = {
    navigation: Navigation;
    route: {
        params: {
            Calendrier: Calendrier;
        };
    };
};
const CalendrierAjouterScreen = ({ navigation,route }: Props & Props1) => {
    const navigation1 = useNavigation();
    const { Calendrier } = route.params;

    const [editedCalendrier, seteditedCalendrier] = useState<Calendrier>(Calendrier);
    const { userToken, verifyToken } = useContext(AuthContext);

    const handleSave = async () => {
        const {name ,reference_doctype,subject_field,start_date_field,end_date_field}=editedCalendrier;
         if (!name || !reference_doctype || !subject_field || !start_date_field || !end_date_field) {
            Alert.alert("Erreur", "Veuillez remplir tous les champs");
            return;
        }
        try {
            await api.put(`/calendrier/${editedCalendrier.name}`, editedCalendrier);
            navigation1.goBack();
        } catch (error) {
            // console.error(`Error Jouter ${editedCalendrier.name}`, error);
        }
    };

    useEffect(() => {
        if (!userToken) navigation.navigate("LoginScreen");
        verifyToken();
    }, []);

    const handleChange = (field: string, value: string) => {
        seteditedCalendrier(prevState => ({ ...prevState, [field]: value }));
    };

    return (
        <ScrollView >
            <View style={styles.Background}>
            <Frame title={editedCalendrier?.name || '--'}>
                <TextInput
                    autoCapitalize="none"
                    label="Name"
                    value={editedCalendrier.name  ? editedCalendrier.name : ''}
                    returnKeyType="next"
                    onChangeText={value => handleChange('name', value)}
                    placeholder="Name du calendrier"
                />
                 <View style={styles.container}>
                    <Text style={styles.label}>Type du document de référence:</Text>
                    <View style={styles.select}>
                    <RNPickerSelect
                        onValueChange={value => handleChange('reference_doctype', value)}
                        value={editedCalendrier.reference_doctype  ? editedCalendrier.reference_doctype : ''}

                        items={[
                            { label: 'Schedule', value: 'Schedule' },
                           
                        ]}
                        style={pickerSelectStyles}
                    />
                </View>
                </View>
              
                <View style={styles.container}>
                    <Text style={styles.label}>Champ de sujet:</Text>
                    <View style={styles.select}>
                    <RNPickerSelect
                        onValueChange={value => handleChange('subject_field', value)}
                        value={editedCalendrier.subject_field  ? editedCalendrier.subject_field : ''}
                        items={[
                            { label: 'schedule_code', value: 'schedule_code' },
                            { label: 'course', value: 'course' },
                            { label: 'td', value: 'td' },
                            { label: 'tp', value: 'tp' },
                            { label: 'location', value: 'location' },
                            { label: 'start_datetime', value: 'start_datetime' },
                            { label: 'end_datetime', value: 'end_datetime' },
                        ]}
                        style={pickerSelectStyles}
                    />
                </View>
                </View>

                <View style={styles.container}>
                    <Text style={styles.label}>Date de début:</Text>
                    <View style={styles.select}>
                    <RNPickerSelect
                        onValueChange={value => handleChange('start_date_field', value)}
                        value={editedCalendrier.start_date_field  ? editedCalendrier.start_date_field : ''}
                        items={[
                            { label: 'start_datetime', value: 'start_datetime' },
                        ]}
                        style={pickerSelectStyles}
                    />
                </View>
                </View>

                <View style={styles.container}>
                    <Text style={styles.label}>Date de fin:</Text>
                    <View style={styles.select}>
                    <RNPickerSelect
                        onValueChange={value => handleChange('start_date_field', value)}
                        value={editedCalendrier.end_date_field  ? editedCalendrier.end_date_field : ''}
                        items={[
                            { label: 'end_datetime', value: 'end_datetime' },
                        ]}
                        style={pickerSelectStyles}
                    />
                </View>
                </View>
                </Frame>
                <Button mode="contained-tonal" style={{ backgroundColor: '#20B2AA' }}  onPress={handleSave}>Enregistrer</Button>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    Background: {
        flex: 1,
        padding: 20,
        zIndex: 1,
        width: '100%',
        opacity: 1,
        maxWidth: 340,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding:0,
        width: '100%',
        marginBottom: -10,
        marginTop: 20,

      },
      label: {
        marginBottom: 0,
        fontSize: 13,
        marginLeft: 5,
        alignSelf: 'flex-start',
    },
    selectedValue: {
        marginTop: 20,
        fontSize: 16,
    },
    select:{
        
        backgroundColor:'#00ffff',
        width: '100%',
        marginVertical: 5,
        fontWeight: 'bold',
        fontSize: 15,
        borderRadius:20,
        lineHeight: 15,

    }
   
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
    },
   
});

export default CalendrierAjouterScreen;

