import React, { memo, useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal,Alert  } from 'react-native';
import TextInput from '../../components/TextInput';
import Button from '../../components/Button';
import { useNavigation } from '@react-navigation/native';
import api from '../../ApiService';
import { Navigation } from "../../types";
import { Schedule } from "../admin_screens/ScheduleScreen";
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { Picker } from '@react-native-picker/picker';
import { yupResolver } from '@hookform/resolvers/yup';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { AuthContext } from '../../AuthContext';
import Background from '../../components/Background';
import Frame from '../Frame';
type Props2 = {
    navigation1: Navigation;
};

const schema = yup.object().shape({
    name: yup.string().required('Name est nécessaire'),
    schedule_code: yup.string().required('Code plannification est nécessaire'),
    course: yup.string(),
    td: yup.string(),
    tp: yup.string(),
    location: yup.string(),
    start_datetime: yup.date(),
    end_datetime: yup.date()
        .min(yup.ref('start_datetime'), 'La date de fin doit être après la date de début')
});

const UpdateScheduleScreen = ({ navigation1 }: Props2 ) => {
    const navigation = useNavigation();
    const [editedSchedule, setEditedSchedule] = useState<Partial<Schedule>>({
        course: '',
        td: '',
        tp: '',
        location: '',
    });
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [dateField, setDateField] = useState('');
    const { userToken, verifyToken } = useContext(AuthContext);
    const [data, setData] = useState([]);
    const [data2, setData2] = useState([]);
    const [data8, setdata8] = useState([]);
    const [data4, setData4] = useState([]);
    const [modalVisible, setModalVisible] = useState({ course: false, td: false, tp: false, location: false });

    useEffect(() => {
        if (!userToken) navigation1.navigate("LoginScreen");
        verifyToken();

        const fetchData = async () => {
            try {
                const response1 = await api.get(`/cours`);
                setData(response1.data.data);
                const response2 = await api.get(`/td`);
                setData2(response2.data.data);
                const response3 = await api.get(`/tp`);
                setdata8(response3.data.data);
                const response4 = await api.get(`/lieus`);
                setData4(response4.data.data);
            } catch (error) {
                // console.error('Error fetching data', error);
            }
        };
        fetchData();
    }, []);

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
        defaultValues: editedSchedule
    });

    const handleSave = async (data: Schedule) => {
        try {
            await api.post(`/schedule`, data);
            Alert.alert("Succès",'l\'ajout avec succès');
            navigation.goBack();
        } catch (error) {
            // console.error(`Error updating ${data.name}`, error);
        }
    };

    const renderPicker = (name: string, data: any[], modalKey: string) => (
        <View style={styles.pickerWrapper}>
            <Button  mode='contained-tonal' style={{backgroundColor:'#ffdab9'}}   onPress={() => setModalVisible(prevState => ({ ...prevState, [modalKey]: true }))}>
                <Text style={{fontSize:13}}>{editedSchedule[modalKey] || `Choisir ${name}`}</Text>
            </Button>
            <Modal
                transparent={true}
                animationType="slide"
                visible={modalVisible[modalKey]}
                onRequestClose={() => setModalVisible(prevState => ({ ...prevState, [modalKey]: false }))}
            >
                <View style={styles.modalBackground}>
                    <View  style={styles.modalContainer}>
                        <Controller
                            control={control}
                            name={modalKey}
                            render={({ field: { onChange, value } }) => (
                                <>
                                    <Picker  selectedValue={value} onValueChange={(itemValue) => {onChange(itemValue);
                                        setEditedSchedule({ ...editedSchedule, [modalKey]: itemValue });
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
                        <Button mode='elevated' style={{backgroundColor:'#d3d3d3'}} onPress={() => setModalVisible(prevState => ({ ...prevState, [modalKey]: false }))}>Fermer</Button>
                    </View>
                </View>
            </Modal>
        </View>
    );

    return (
        <ScrollView>
            <View style={styles.background}>
            <Frame title='Nouveau(elle) Schedule'>
                <Controller
                    control={control}
                    name="name"
                    render={({ field: { onChange, value } }) => (
                        <>
                            <TextInput
                                value={value}
                                label="Name"
                                returnKeyType="next"
                                autoCapitalize="none"
                                onChangeText={onChange}
                                placeholder="Name"
                                style={errors.name && styles.inputError}
                            />
                            {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
                        </>
                    )}
                />
                <Controller
                    control={control}
                    name="schedule_code"
                    render={({ field: { onChange, value } }) => (
                        <>
                            <TextInput
                                value={value}
                                label="Code plannification"
                                returnKeyType="next"
                                autoCapitalize="none"
                                onChangeText={onChange}
                                placeholder="Code plannification"
                                style={errors.schedule_code && styles.inputError}
                            />
                            {errors.schedule_code && <Text style={styles.errorText}>{errors.schedule_code.message}</Text>}
                        </>
                    )}
                />
                {renderPicker('un cours', data, 'course')}
                {renderPicker('un TD', data2, 'td')}
                {renderPicker('un TP', data8, 'tp')}
                {renderPicker('un lieu', data4, 'location')}
                <Text style={styles.label}>Date et heure de début :</Text>
                <Button mode="contained-tonal" style={{backgroundColor:'#add8e6'}} onPress={() => showDatePicker('start_datetime')}>
                    <Controller
                        control={control}
                        name="start_datetime"
                        render={({ field: { value } }) => (
                            <Text style={styles.datetimeText}>
                                {value ? new Date(value).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) : 'Sélectionnez la date et l\'heure'}
                            </Text>
                        )}
                    />
                </Button>
                {errors.start_datetime && <Text style={styles.errorText}>{errors.start_datetime.message}</Text>}

                <Text style={styles.label}>Date et heure de fin :</Text>
                <Button mode="contained-tonal" style={{backgroundColor:'#add8e6'}} onPress={() => showDatePicker('end_datetime')}>
                    <Controller
                        control={control}
                        name="end_datetime"
                        render={({ field: { value } }) => (
                            <Text style={styles.datetimeText}>
                                {value ? new Date(value).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) : 'Sélectionnez la date et l\'heure'}
                            </Text>
                        )}
                    />
                </Button>
                {errors.end_datetime && <Text style={styles.errorText}>{errors.end_datetime.message}</Text>}
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
    background: {
        flex: 1,
        padding: 20,
        width: '100%',
        maxWidth: 340,
        alignSelf: 'center',
        alignItems: 'center',
    },
    pickerWrapper: {
        paddingTop: 30,
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
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
    inputError: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        alignSelf: 'flex-start',
    },
    datetimeText: {
        marginBottom: 10,
        fontSize:12,
    },
    label: {
        marginTop: 15,
        marginBottom: 3,
        fontSize: 13,
        marginLeft: 5,
        alignSelf: 'flex-start',
    },
    picker: {
        width: '100%',
        backgroundColor:'#7fffd4',
        marginVertical: 10,
        fontWeight: 'bold',
        fontSize: 40,
        borderRadius:20,
        lineHeight: 20,
    },
    pickerText: {
        // fontSize: 14,
        color: '#000',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: '#f0f8ff',
        borderRadius: 10,
        padding: 20,
    },
});

export default memo(UpdateScheduleScreen);








// import React, { memo, useState,useContext,useEffect } from 'react';
// import { View, Text, StyleSheet, ScrollView,Modal } from 'react-native';
// import TextInput from '../../components/TextInput';
// import Button from '../../components/Button';
// import { useNavigation } from '@react-navigation/native';
// import api from '../../ApiService';
// import { Navigation } from "../../types";
// import { Schedule } from "../admin_screens/ScheduleScreen";
// import { useForm, Controller } from 'react-hook-form';
// import * as yup from 'yup';
// import { Picker } from '@react-native-picker/picker';
// import { yupResolver } from '@hookform/resolvers/yup';
// import DateTimePickerModal from 'react-native-modal-datetime-picker';
// import { AuthContext } from '../../AuthContext';
// import { Course } from '../admin_screens/CoursScreen';
// type Props2 = {
//     navigation1: Navigation;
//   };

// const schema = yup.object().shape({
//     name: yup.string().required('Name est nécessaire'),
//     schedule_code: yup.string().required('Code plannification est nécessaire'),
//     course: yup.string(),
//     td: yup.string(),
//     tp: yup.string(),
//     location: yup.string(),
//     start_datetime: yup.date(),
//     end_datetime: yup.date()
//         .min(yup.ref('start_datetime'), 'La date de fin doit être après la date de début')
// });

// const UpdateScheduleScreen = ({navigation1 }: Props2 ) => {
//     const navigation = useNavigation();
//     // const { Schedule } = route.params;
//     // const [editedSchedule, setEditedSchedule] = useState<Schedule>({});
//     const [editedSchedule, setEditedSchedule] = useState<Partial<Schedule>>({
//         // schedule_code: '',
//         course: '',
//         td: '',
//         tp: '',
//         location: '',
//         // start_datetime: '',
//         // end_datetime: '',
//     });
//     const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
//     const [dateField, setDateField] = useState('');
//     const { userToken, verifyToken } = useContext(AuthContext);
//     const [selectedValue1, setSelectedValue1] = useState(""); 
//     const [selectedValue2, setSelectedValue2] = useState(""); 
//     const [selectedValue3, setSelectedValue3] = useState(""); 
//     const [selectedValue4, setSelectedValue4] = useState(""); 
//     const [data, setData] = useState([]);
//     const [data2, setData2] = useState([]);
//     const [data8, setdata8] = useState([]);
//     const [data4, setData4] = useState([]);
//     const [modalVisible, setModalVisible] = useState<boolean>(false);




//     useEffect(() => {
//         if (!userToken) navigation1.navigate("LoginScreen");
//         verifyToken();


//             const fetchData1 = async () => {
//         try {
//           const response = await api.get(`/cours`);
//           setData(response.data.data);
//           if (response.data.data.length > 0) {
//             setSelectedValue1(response.data.data[0].name);
//           }
//         } catch (error) {
//         //   console.error('Error fetching data', error.toJSON());
//         }
//       };
//         fetchData1();

//         const fetchData2 = async () => {
//             try {
//               const response = await api.get(`/td`);
//               setData2(response.data.data);
//             //   if (response.data.data.length > 0) {
//             //     setSelectedValue2(response.data.data[0].name);
//             //   }
//             } catch (error) {
//             //   console.error('Error fetching data', error.toJSON());
//             }
//           };
//             fetchData2();

            
//         const fetchdata8 = async () => {
//             try {
//               const response = await api.get(`/tp`);
//               setdata8(response.data.data);
//             //   if (response.data.data.length > 0) {
//             //     setSelectedValue3(response.data.data[0].name);
//             //   }
//             } catch (error) {
//             //   console.error('Error fetching data', error.toJSON());
//             }
//           };
//             fetchdata8();
            
//         const fetchData4 = async () => {
//             try {
//               const response = await api.get(`/lieus`);
//               setData4(response.data.data);
//             //   if (response.data.data.length > 0) {
//             //     setSelectedValue4(response.data.data[0].name);
//             //   }
//             } catch (error) {
//             //   console.error('Error fetching data', error.toJSON());
//             }
//           };
//             fetchData4();

//       }, []);

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
//         defaultValues: editedSchedule
//     });

//     const handleSave = async (data: Schedule) => {
//         try {
//             await api.post(`/schedule`, data);
//             navigation.goBack();
//         } catch (error) {
//             console.error(`Error updating ${data.name}`, error);
//         }
//     };

    
//     return (
//         <ScrollView>
//             <View style={styles.Background}>
//                 <Controller
//                     control={control}
//                     name="name"
//                     render={({ field: { onChange, onBlur, value } }) => (
//                         <>
//                             <TextInput
//                                 value={value}
//                                 label="Name"
//                                 returnKeyType="next"
//                                 autoCapitalize="none"
//                                 // onBlur={onBlur}
//                                 onChangeText={onChange}
//                                 placeholder="Name"
//                                 style={[errors.name && styles.inputError]}
//                             />
//                             {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
//                         </>
//                     )}
//                 />
//                 <Controller
//                     control={control}
//                     name="schedule_code"
//                     render={({ field: { onChange, onBlur, value } }) => (
//                         <>
//                             <TextInput
//                                 value={value}
//                                 label="Code plannification"
//                                 returnKeyType="next"
//                                 autoCapitalize="none"
//                                 // onBlur={onBlur}
//                                 onChangeText={onChange}
//                                 placeholder="Code plannification"
//                                 style={[errors.schedule_code && styles.inputError]}
//                             />
//                             {errors.schedule_code && <Text style={styles.errorText}>{errors.schedule_code.message}</Text>}
//                         </>
//                     )}
//                 />
//             <View style={{ paddingTop: 30, flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
//             <Button
//                 style={styles.pickerContainer}
//                 onPress={() => setModalVisible(true)}
//             >
//                 <Text style={styles.pickerText}>
//                 Choiser un cours
//                 </Text>
//             </Button>
//             <Modal
//             transparent={true}
//             animationType="slide"
//             visible={modalVisible}
//             onRequestClose={() => setModalVisible(false)}
//             >
//                 <View style={styles.modalBackground}>
//                 <View style={styles.modalContainer}>
//                 <Controller
//                     control={control}
//                     name="course"
//                     render={({ field: { onChange, onBlur, value } }) => (
//                         <>
//                     <Picker
//                     selectedValue={value}
                    
//                     onValueChange={onChange}
//                     style={styles.picker}
//                     >
//                     {data.map((item1, index0) => (
//                         <Picker.Item  key={index0} label={`${item1.name}`} value={item1.name} />
//                     ))}
//                     </Picker>
//                      {/* {errors.course && <Text style={styles.errorText}>{errors.course.message}</Text>} */}
//                         </>
//                     )}
//                 />
//                 </View>
//                 </View>
//                 </Modal>
//             </View>
              
//             <View style={{ paddingTop: 30, flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
//             <Button
//                 style={styles.pickerContainer}
//                 onPress={() => setModalVisible(true)}
//             >
//                 <Text style={styles.pickerText}>
//                 Choiser un td
//                 </Text>
//             </Button>
//             <Modal
//             transparent={true}
//             animationType="slide"
//             visible={modalVisible}
//             onRequestClose={() => setModalVisible(false)}
//             >
//                 <View style={styles.modalBackground}>
//                 <View style={styles.modalContainer}>
//                 <Controller
//                     control={control}
//                     name="td"
//                     render={({ field: { onChange, onBlur, value } }) => (
//                         <>
//                     <Picker
//                     selectedValue={value}
                    
//                     onValueChange={onChange}
//                     style={styles.picker}
//                     >
//                     {data2.map((item2, index1) => (
//                         <Picker.Item  key={index1} label={`${item2.name}`} value={item2.name} />
//                     ))}
//                     </Picker>
//                      {/* {errors.td && <Text style={styles.errorText}>{errors.td.message}</Text>} */}
//                         </>
//                     )}
//                 />
//                 </View>
//                 </View>
//                 </Modal>
//             </View>
            
//             <View style={{ paddingTop: 30, flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
//             <Button
//                 style={styles.pickerContainer}
//                 onPress={() => setModalVisible(true)}
//             >
//                 <Text style={styles.pickerText}>
//                 Choiser un tp
//                 </Text>
//             </Button>
//             <Modal
//             transparent={true}
//             animationType="slide"
//             visible={modalVisible}
//             onRequestClose={() => setModalVisible(false)}
//             >
//                 <View style={styles.modalBackground}>
//                 <View style={styles.modalContainer}>
//                 <Controller
//                     control={control}
//                     name="tp"
//                     render={({ field: { onChange, onBlur, value } }) => (
//                         <>
//                     <Picker
//                     selectedValue={value}
                    
//                     onValueChange={onChange}
//                     style={styles.picker}
//                     >
//                     {data8.map((item, index3) => (
//                         <Picker.Item  key={index3} label={`${item.name}`} value={item.name} />
//                     ))}
//                     </Picker>
//                      {errors.tp && <Text style={styles.errorText}>{errors.tp.message}</Text>}
//                         </>
//                     )}
//                 />
//                 </View>
//                 </View>
//                 </Modal>
//             </View>
               


//             <View style={{ paddingTop: 30, flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
//             <Button
//                 style={styles.pickerContainer}
//                 onPress={() => setModalVisible(true)}
//             >
//                 <Text style={styles.pickerText}>
//                 Choiser un lieu
//                 </Text>
//             </Button>
//             <Modal
//             transparent={true}
//             animationType="slide"
//             visible={modalVisible}
//             onRequestClose={() => setModalVisible(false)}
//             >
//                 <View style={styles.modalBackground}>
//                 <View style={styles.modalContainer}>
//                 <Controller
//                     control={control}
//                     name="location"
//                     render={({ field: { onChange, onBlur, value } }) => (
//                         <>
//                     <Picker
//                     selectedValue={value}
                    
//                     onValueChange={onChange}
//                     style={styles.picker}
//                     >
//                     {data4.map((item, index2) => (
//                         <Picker.Item  key={index2} label={`${item.name}`} value={item.name} />
//                     ))}
//                     </Picker>
//                      {errors.location && <Text style={styles.errorText}>{errors.location.message}</Text>}
//                         </>
//                     )}
//                 />
//                 </View>
//                 </View>
//                 </Modal>
//             </View>
               
               
//                 <Text>Date et heure de début :</Text>
//                 <Button mode="contained-tonal" onPress={() => showDatePicker('start_datetime')}>
//                     <Controller
//                         control={control}
//                         name="start_datetime"
//                         render={({ field: { value } }) => (
//                             <Text style={styles.datetimeText}>
//                                 {editedSchedule.start_datetime ? new Date(value).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) : 'Sélectionnez la date et l\'heure'}
//                             </Text>
//                         )}
//                     />
//                 </Button>
//                 {errors.start_datetime && <Text style={styles.errorText}>{errors.start_datetime.message}</Text>}

//                 <Text>Date et heure de fin :</Text>
//                 <Button mode="contained-tonal" onPress={() => showDatePicker('end_datetime')}>
//                     <Controller
//                         control={control}
//                         name="end_datetime"
//                         render={({ field: { value } }) => (
//                             <Text style={styles.datetimeText}>
//                                 {editedSchedule.end_datetime ? new Date(value).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) : 'Sélectionnez la date et l\'heure'}
//                             </Text>
//                         )}
//                     />
//                 </Button>
//                 {errors.end_datetime && <Text style={styles.errorText}>{errors.end_datetime.message}</Text>}

//                 <Button mode="contained" onPress={handleSubmit(handleSave)}>Enregistrer</Button>

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
//     pickerContainer: {
//         width: '100%',
//         height: 50,
//         borderColor: '#ccc',
//         borderWidth: 1,
//         borderRadius: 4,
//         justifyContent: 'center',
//         paddingHorizontal: 10,
//         backgroundColor: '#fff',
//       },
//     inputError: {
//         borderColor: 'red',
//     },
//     errorText: {
//         color: 'red',
//         alignSelf: 'flex-start',
//     },
//     datetimeText: {
//         marginBottom: 10,
//     },
//     picker: {
//         width: '100%',
//         paddingBottom: 40
//         // Add other styles for the Picker
//       },
//       pickerStudent: {
//         width: '100%',
//         paddingBottom: 40,
//         fontWeight: 'bold'
//         // Add other styles for the Picker
//       },
//       pickerText: {
//         fontSize: 16,
//         color: '#000',
//       },
//       modalBackground: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'rgba(0, 0, 0, 0.5)',
//       },
//       modalContainer: {
//         width: '80%',
//         backgroundColor: '#fff',
//         borderRadius: 10,
//         padding: 20,
//       },
  
// });

// export default memo(UpdateScheduleScreen);

