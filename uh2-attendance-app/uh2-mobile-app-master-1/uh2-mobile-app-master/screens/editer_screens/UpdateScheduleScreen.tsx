import React, { memo, useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal ,Alert} from 'react-native';
import TextInput from '../../components/TextInput';
import Button from '../../components/Button';
import { useNavigation } from '@react-navigation/native';
import api from '../../ApiService';
import { Navigation } from "../../types";
import { Schedule } from "../admin_screens/ScheduleScreen";
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { AuthContext } from '../../AuthContext';
import { Picker } from '@react-native-picker/picker';
import Frame from '../Frame';
type Props1 = {
    navigation: Navigation;
    route: {
        params: {
            Schedule: Schedule;
        };
    };
};

type Props2 = {
    navigation1: Navigation;
};

const schema = yup.object().shape({
    schedule_code: yup.string().required('Code plannification est nécessaire'),
    start_datetime: yup.date().nullable(),
    end_datetime: yup.date().nullable()
        .min(yup.ref('start_datetime'), 'La date de fin doit être après la date de début')
});

const UpdateScheduleScreen = ({ route, navigation1 }: Props1 & Props2) => {
    const navigation = useNavigation();
    const { Schedule } = route.params;
    const [editedSchedule, setEditedSchedule] = useState<Schedule>(Schedule);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [dateField, setDateField] = useState('');
    const { userToken, verifyToken } = useContext(AuthContext);
    const [data, setData] = useState([]);
    const [data2, setData2] = useState([]);
    const [data3, setData3] = useState([]);
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
                setData3(response3.data.data);
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
            await api.put(`/schedule/${data.name}`, data);
            Alert.alert("Succès",'Mise à jours avec succès');
            navigation.goBack();
        } catch (error) {
            // console.error(`Error updating ${data.name}`, error);
        }
    };

    const renderPicker = (name: string, data: any[], modalKey: string) => (
        <View style={styles.pickerWrapper}>
            <Button mode='contained-tonal' style={{backgroundColor:'#ffdab9'}}  onPress={() => setModalVisible(prevState => ({ ...prevState, [modalKey]: true }))}>
                <Text style={styles.pickerText}>
                    {editedSchedule[modalKey] || `Choisir ${name}`}
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
                                    <Picker selectedValue={value} onValueChange={(itemValue) => {onChange(itemValue);
                                    setEditedSchedule({ ...editedSchedule, [modalKey]: itemValue }); 
                                    setModalVisible(prevState => ({ ...prevState, [modalKey]: false }));}} style={styles.picker}>
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
            <View style={styles.Background}>
            <Frame title={editedSchedule?.name || '--'}>
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
                <Text style={styles.label1}>Cours:</Text>
                {renderPicker('un cours', data, 'course')}
                <Text style={styles.label1}>TD:</Text>
                {renderPicker('un TD', data2, 'td')}
                <Text style={styles.label1}>TP:</Text>
                {renderPicker('un TP', data3, 'tp')}
                <Text style={styles.label1}>Emplacement:</Text>
                {renderPicker('un lieu', data4, 'location')}

                <Text style={styles.label}>Date et heure de début :</Text>
                <Button mode="contained-tonal" onPress={() => showDatePicker('start_datetime')}>
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
                <Button mode="contained-tonal" onPress={() => showDatePicker('end_datetime')}>
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
    Background: {
        flex: 1,
        padding: 20,
        width: '100%',
        maxWidth: 340,
        alignSelf: 'center',
        alignItems: 'center',
    },
    label: {
        marginTop: 15,
        marginBottom: 3,
        fontSize: 13,
        marginLeft: 5,
        alignSelf: 'flex-start',
    },
    label1: {
        marginBottom:-30,
        marginTop: 30,
        fontSize: 13,
        marginLeft: 5,
        alignSelf: 'flex-start',
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
        fontSize: 13,
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
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
    },
});

export default memo(UpdateScheduleScreen);
