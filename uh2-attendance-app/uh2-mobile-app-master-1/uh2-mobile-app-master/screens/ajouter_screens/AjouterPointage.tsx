import React, { memo, useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, Alert } from 'react-native';
import TextInput from '../../components/TextInput';
import Button from '../../components/Button';
import { useNavigation } from '@react-navigation/native';
import api from '../../ApiService';
import { Navigation } from "../../types";
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { AuthContext } from '../../AuthContext';
import { Picker } from '@react-native-picker/picker';
import RNPickerSelect from "react-native-picker-select";
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Frame from '../Frame';

type Props = {
    navigation: Navigation;
};

export interface Pointage {
    name: string;
    schedule: string;
    etudiant: string;
    date_effet: string;
    status: string;
}

const schema = yup.object().shape({
    date_effet: yup.date().nullable(),
});

const AjouterPointageScreen = ({ navigation }: Props) => {
    const [ajouterPointage, setajouterPointage] = useState<Pointage>({
        name: '',
        schedule: '',
        etudiant: '',
        date_effet: '',
        status: '',
    });
    const { userToken, verifyToken } = useContext(AuthContext);
    const [data, setData] = useState([]);
    const [data2, setData2] = useState([]);
    const [modalVisible, setModalVisible] = useState({ schedule: false, etudiant: false });
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [dateField, setDateField] = useState('');
    const navigation1 = useNavigation();

    useEffect(() => {
        if (!userToken) navigation.navigate("LoginScreen");

        const fetchData = async () => {
            try {
                const response1 = await api.get(`/schedules`);
                setData(response1.data.data);
                const response2 = await api.get(`/students`);
                setData2(response2.data.data);
            } catch (error) {
                // Alert.alert("Erreur", "Erreur lors de la récupération des données");
            }
        };
        fetchData();
        verifyToken();
    }, [userToken, navigation]);

    const handleSave = async (data: Pointage) => {
        try {
            await api.post(`/pointage`, data);
            Alert.alert("Succès", 'Mise à jour avec succès');
            navigation1.goBack();
        } catch (error) {
            console.error(`Error ajouter ${data.name}`, error);
            Alert.alert("Erreur", "Erreur lors de la mise à jour");
        }
    };

    const showDatePicker = (field: string) => {
        setDateField(field);
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (selectedDate: Date) => {
        setValue(dateField, selectedDate.toISOString());
        hideDatePicker();
    };

    const { control, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: ajouterPointage
    });

    const renderPicker = (name: string, data: any[], modalKey: string) => (
        <View style={styles.pickerWrapper}>
            <Button mode='contained-tonal' style={{ backgroundColor: '#ffdab9' }} onPress={() => setModalVisible(prevState => ({ ...prevState, [modalKey]: true }))}>
                <Text style={styles.pickerText}>
                    {ajouterPointage[modalKey] || `Choisir ${name}`}
                </Text>
            </Button>
            <Modal
                transparent={true}
                animationType="slide"
                visible={modalVisible[modalKey]}
                onRequestClose={() => setModalVisible(prevState => ({ ...prevState, [modalKey]: false }))}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Controller
                            control={control}
                            name={modalKey}
                            render={({ field: { onChange, value } }) => (
                                <>
                                    <Picker selectedValue={value} onValueChange={(itemValue) => {
                                        onChange(itemValue);
                                        setajouterPointage({ ...ajouterPointage, [modalKey]: itemValue });
                                        setModalVisible(prevState => ({ ...prevState, [modalKey]: false }));
                                    }} style={styles.picker}>
                                        <Picker.Item label="Aucun" value="" />
                                        {data.map((item, index) => (
                                            <Picker.Item key={index} label={item.name} value={item.name} />
                                        ))}
                                    </Picker>
                                    {errors[modalKey] && <Text style={styles.errorText}>{errors[modalKey]?.message}</Text>}
                                </>
                            )}
                        />
                        <Button mode='elevated' style={{ backgroundColor: '#d3d3d3' }} onPress={() => setModalVisible(prevState => ({ ...prevState, [modalKey]: false }))}>Fermer</Button>
                    </View>
                </View>
            </Modal>
        </View>
    );

    return (
        <ScrollView>
            <View style={styles.Background}>
                <Frame title="Nouveau(elle) Pointage">
                    <Text style={styles.label1}>Schedule:</Text>
                    {renderPicker('un schedule', data, 'schedule')}
                    <Text style={styles.label1}>Etudiant:</Text>
                    {renderPicker('un étudiant', data2, 'etudiant')}

                    <Text style={styles.label2}>Date effet du pointage :</Text>
                    <Button mode="contained-tonal" style={{ backgroundColor: '#add8e6' }} onPress={() => showDatePicker('date_effet')}>
                        <Controller
                            control={control}
                            name="date_effet"
                            render={({ field: { value } }) => (
                                <Text style={styles.datetimeText}>
                                    {value ? new Date(value).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) : 'Sélectionnez la date et l\'heure'}
                                </Text>
                            )}
                        />
                    </Button>

                    <Controller
                        control={control}
                        name="status"
                        render={({ field: { onChange, value } }) => (
                            <View style={styles.container}>
                                <Text style={styles.label}>Sélectionnez un status :</Text>
                                <View style={styles.select}>
                                    <RNPickerSelect
                                        onValueChange={onChange}
                                        items={[
                                            { label: 'Present', value: 'Present' },
                                            { label: 'Absent', value: 'Absent' },
                                        ]}
                                        value={value}
                                        placeholder={{ label: "Sélectionnez un status", value: "" }}
                                        style={pickerSelectStyles}
                                    />
                                </View>
                            </View>
                        )}
                    />
                </Frame>
                <Button mode="contained-tonal" style={{ backgroundColor: '#20B2AA' }} onPress={handleSubmit(handleSave)}>Enregistrer</Button>
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="datetime"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                />
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
    select: {
        backgroundColor: '#ffdab9',
        width: '100%',
        marginVertical: 10,
        fontWeight: 'bold',
        fontSize: 40,
        borderRadius: 20,
        lineHeight: 20,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
        width: '100%',
        marginBottom: -10,
        marginTop: 20,
    },
    datetimeText: {
        marginBottom: 20,
        fontSize: 12,
    },
    label: {
        marginBottom: 0,
        marginTop: 5,
        fontSize: 13,
        marginLeft: 5,
        alignSelf: 'flex-start',
    },
    label2: {
        marginBottom: 0,
        marginTop: 25,
        fontSize: 13,
        marginLeft: 5,
        alignSelf: 'flex-start',
    },
    label1: {
        marginBottom: -30,
        marginTop: 25,
        fontSize: 13,
        marginLeft: 5,
        alignSelf: 'flex-start',
    },
    pickerWrapper: {
        paddingTop: 30,
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    picker: {
        width: '100%',
        backgroundColor: '#7fffd4',
        marginVertical: 10,
        fontWeight: 'bold',
        fontSize: 40,
        borderRadius: 20,
        lineHeight: 20,
    },
    pickerText: {
        fontSize: 13,
        color: '#000',
    },
    pickerContainer: {
        width: '100%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 4,
        justifyContent: 'center',
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
    },
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
        paddingRight: 30,
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
    },
});

export default memo(AjouterPointageScreen);


// import React, { memo, useEffect, useState, useContext } from 'react';
// import { View, Text, StyleSheet, ScrollView, Modal, Alert } from 'react-native';
// import TextInput from '../../components/TextInput';
// import Button from '../../components/Button';
// import { useNavigation } from '@react-navigation/native';
// import api from '../../ApiService';
// import { Navigation } from "../../types";
// import { useForm, Controller } from 'react-hook-form';
// import * as yup from 'yup';
// import { yupResolver } from '@hookform/resolvers/yup';
// import { AuthContext } from '../../AuthContext';
// import { Picker } from '@react-native-picker/picker';
// import RNPickerSelect from "react-native-picker-select";
// import DateTimePickerModal from 'react-native-modal-datetime-picker';
// import Frame from '../Frame';


// type Props = {
//     navigation: Navigation;
   
// };
// export  interface Pointage {

//     name:string;
  
//     schedule:string;
  
//     etudiant:string;
  
//     date_effet: string;
  
//     status: string;
  
//   }

// const schema = yup.object().shape({
//     date_effet: yup.date().nullable(),
// });

// const AjouterPointageScreen = ({ navigation }: Props) => {
    
//     const [ajouterPointage, setajouterPointage] = useState<Pointage>({
//         name:'',
  
//     schedule:'',
  
//     etudiant:'',
  
//     date_effet: '',
  
//     status: '',
//     });
//     const { userToken,verifyToken } = useContext(AuthContext);
//     const [data, setData] = useState([]);
//     const [data2, setData2] = useState([]);
//     const [modalVisible, setModalVisible] = useState({ schedule: false, etudiant: false });
//     const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
//     const [dateField, setDateField] = useState('');
//     const navigation1 = useNavigation();
   
//     useEffect(() => {
//         if (!userToken) navigation.navigate("LoginScreen");

//         const fetchData = async () => {
//             try {
//                 const response1 = await api.get(`/schedules`);
//                 setData(response1.data.data);
//                 const response2 = await api.get(`/students`);
//                 setData2(response2.data.data);
//             } catch (error) {
//                 // Alert.alert("Erreur", "Erreur lors de la récupération des données");
//             }
//         };
//         fetchData();
//         verifyToken();
//     }, [userToken, navigation]);

//     const handleSave = async (data: Pointage) => {
        
//         try {
//             await api.post(`/pointage`, data); 
//             Alert.alert("Succès", 'Mise à jour avec succès');
//             navigation1.goBack();
//         } catch (error) {
//             Alert.alert("Erreur", "Erreur lors de la mise à jour");
//         }
//     };

//     const showDatePicker = (field: string) => {
//         setDateField(field);
//         setDatePickerVisibility(true);
//     };

//     const hideDatePicker = () => {
//         setDatePickerVisibility(false);
//     };

//     const handleConfirm = (selectedDate: Date) => {
//         setValue(dateField, selectedDate.toISOString());
//         hideDatePicker();
//     };

//     const { control, handleSubmit, setValue, formState: { errors } } = useForm({
//         resolver: yupResolver(schema),
//         defaultValues: ajouterPointage
//     });

//     const renderPicker = (name: string, data: any[], modalKey: string) => (
//         <View style={styles.pickerWrapper}>
//             <Button mode='contained-tonal' style={{backgroundColor:'#ffdab9'}}  onPress={() => setModalVisible(prevState => ({ ...prevState, [modalKey]: true }))}>
//                 <Text style={styles.pickerText}>
//                     {ajouterPointage[modalKey] || `Choisir ${name}`}
//                 </Text>
//             </Button>
//             <Modal
//                 transparent={true}
//                 animationType="slide"
//                 visible={modalVisible[modalKey]}
//                 onRequestClose={() => setModalVisible(prevState => ({ ...prevState, [modalKey]: false }))}
//             >
//                 <View style={styles.modalBackground}>
//                     <View style={styles.modalContainer}>
//                         <Controller
//                             control={control}
//                             name={modalKey}
//                             render={({ field: { onChange, value } }) => (
//                                 <>
//                                     <Picker selectedValue={value} onValueChange={(itemValue) => {onChange(itemValue);
//                                     setajouterPointage({ ...ajouterPointage, [modalKey]: itemValue }); 
//                                     setModalVisible(prevState => ({ ...prevState, [modalKey]: false }));}} style={styles.picker}>
//                                         <Picker.Item label="Aucun" value="" />
//                                         {data.map((item, index) => (
//                                             <Picker.Item key={index} label={item.name} value={item.name} />
//                                         ))}
//                                     </Picker>
//                                     {/* {errors[modalKey] && <Text style={styles.errorText}>{errors[modalKey]?.message}</Text>} */}
//                                 </>
//                             )}
//                         />
//                         <Button mode='elevated' style={{backgroundColor:'#d3d3d3'}} onPress={() => setModalVisible(prevState => ({ ...prevState, [modalKey]: false }))}>Fermer</Button>
//                     </View>
//                 </View>
//             </Modal>
//         </View>
//     );

   

//     return (
//         <ScrollView>
//             <View style={styles.Background}>
//                 <Frame title="Nouveau(elle) Pointage">
                    
            


//                     <Text style={styles.label1}>Schedule:</Text>
//                     {renderPicker('un schedule', data, 'schedule')}
//                     <Text style={styles.label1}>Etudiant:</Text>
//                     {renderPicker('un étudiant', data2, 'etudiant')}

//                     <Text style={styles.label2}>Date effet du pointage :</Text>
//                     <Button mode="contained-tonal" style={{ backgroundColor: '#add8e6' }} onPress={() => showDatePicker('date_effet')}>
//                         <Controller
//                             control={control}
//                             name="date_effet"
//                             render={({ field: { value } }) => (
//                                 <Text style={styles.datetimeText}>
//                                     {value ? new Date(value).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) : 'Sélectionnez la date et l\'heure'}
//                                 </Text>
//                             )}
//                         />
//                     </Button>


//                     <Controller
//                     control={control}
//                     name="status"
//                     render={({ field: { onChange, onBlur, value } }) => (
//                         <>
//                             <View style={styles.container}>
//                                 <Text style={styles.label}>Sélectionnez un cycle :</Text>
//                                 <View style={styles.select}>
//                                 <RNPickerSelect
//                                     onValueChange={onChange}
//                                     items={[
//                                         { label: 'Present', value: 'Present' },
//                                         { label: 'Absent', value: 'Absent' },
//                                     ]}
//                                     value={value}
//                                     placeholder={{ label: "Sélectionnez un status", value: "" }}
//                                     style={pickerSelectStyles}
//                                 />
//                             </View>
//                             </View>
//                             {/* {errors.cycle && <Text style={styles.errorText}>{errors.cycle.message}</Text>} */}
//                         </>
                        
//                     )}
//                 />
                 
//                 </Frame>
//                 <Button mode="contained-tonal" style={{ backgroundColor: '#32cd32' }} onPress={handleSubmit(handleSave)}>Enregistrer</Button>
//                 <DateTimePickerModal
//                     isVisible={isDatePickerVisible}
//                     mode="datetime"
//                     onConfirm={handleConfirm}
//                     onCancel={hideDatePicker}
//                 />
//             </View>
//         </ScrollView>
//     );
// };

// const styles = StyleSheet.create({
//     Background: {
//         flex: 1,
//         padding: 20,
//         zIndex: 1,
//         width: '100%',
//         opacity: 1,
//         maxWidth: 340,
//         alignSelf: 'center',
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     select: {
//         backgroundColor: '#ffdab9',
//         width: '100%',
//         marginVertical: 10,
//         fontWeight: 'bold',
//         fontSize: 40,
//         borderRadius: 20,
//         lineHeight: 20,
//     },
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 0,
//         width: '100%',
//         marginBottom: -10,
//         marginTop: 20,
//     },
//     datetimeText: {
//         marginBottom: 20,
//         fontSize: 12,
//     },
//     label: {
//         marginBottom: 0,
//         marginTop: 5,
//         fontSize: 13,
//         marginLeft: 5,
//         alignSelf: 'flex-start',
//     },
//     label2: {
//         marginBottom: 0,
//         marginTop: 25,
//         fontSize: 13,
//         marginLeft: 5,
//         alignSelf: 'flex-start',
//     },
//     label1: {
//         marginBottom: -30,
//         marginTop: 25,
//         fontSize: 13,
//         marginLeft: 5,
//         alignSelf: 'flex-start',
//     },
//     pickerWrapper: {
//         paddingTop: 30,
//         flex: 1,
//         width: '100%',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     picker: {
//         width: '100%',
//         backgroundColor: '#7fffd4',
//         marginVertical: 10,
//         fontWeight: 'bold',
//         fontSize: 40,
//         borderRadius: 20,
//         lineHeight: 20,
//     },
//     pickerText: {
//         fontSize: 13,
//         color: '#000',
//     },
//     pickerContainer: {
//         width: '100%',
//         height: 50,
//         borderColor: '#ccc',
//         borderWidth: 1,
//         borderRadius: 4,
//         justifyContent: 'center',
//         paddingHorizontal: 10,
//         backgroundColor: '#fff',
//     },
//     modalBackground: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     },
//     modalContainer: {
//         width: '80%',
//         backgroundColor: '#fff',
//         borderRadius: 10,
//         padding: 20,
//     },
// });

// const pickerSelectStyles = StyleSheet.create({
//     inputIOS: {
//         fontSize: 16,
//         paddingVertical: 12,
//         paddingHorizontal: 10,
//         borderWidth: 1,
//         borderColor: 'gray',
//         borderRadius: 4,
//         color: 'black',
//         paddingRight: 30,
//     },
//     inputAndroid: {
//         fontSize: 16,
//         paddingHorizontal: 10,
//         paddingVertical: 8,
//         borderWidth: 0.5,
//     },
// });

// export default memo(AjouterPointageScreen);

