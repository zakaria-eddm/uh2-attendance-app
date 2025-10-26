import React, { memo, useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, Alert } from 'react-native';
import TextInput from '../../components/TextInput';
import Button from '../../components/Button';
import { useNavigation } from '@react-navigation/native';
import api from '../../ApiService';
import { Navigation } from "../../types";
import { Picker } from '@react-native-picker/picker';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { AuthContext } from '../../AuthContext';
import RNPickerSelect from "react-native-picker-select";
import CheckBox from 'react-native-checkbox';
import Frame from '../Frame';
import { Course } from "../admin_screens/CoursScreen";

type Props2 = {
    navigation1: Navigation;
};

type Props = {
    navigation: Navigation;
    route: {
        params: {
            Course: Course;
        };
    };
};

export interface Etudiant {
    etudiant: string;
}

const schema = yup.object().shape({
    code_cours: yup.string().required('Code cours est nécessaire'),
    ann_univ: yup.string().nullable(),
    professor: yup.string().nullable(),
    department: yup.string().nullable(),
    etudiants: yup.array().nullable(),
});

const UpdateCourseScreen = ({ navigation1, route }: Props2 & Props) => {
    const navigation = useNavigation();
    const [data, setData] = useState([]);
    const [data2, setData2] = useState([]);
    const [data3, setData3] = useState([]);
    const [modalVisible, setModalVisible] = useState({ professor: false, department: false, etudiants: false });
    const { Course } = route.params;
    const [editerCourse, setEditerCourse] = useState<Course>(Course);
    const [selectedEtudiants, setSelectedEtudiants] = useState<Etudiant[]>(Course.etudiants || []);
    const { userToken, verifyToken } = useContext(AuthContext);

    useEffect(() => {
        if (!userToken) navigation1.navigate("LoginScreen");

        const fetchData = async () => {
            try {
                const response1 = await api.get(`/professeurs`);
                setData(response1.data.data);
                const response2 = await api.get(`/departements`);
                setData2(response2.data.data);
                const response3 = await api.get(`/students`);
                setData3(response3.data.data);
            } catch (error) {
                // console.error('Error fetching data', error);
            }
        };
        fetchData();
    }, []);

    const handleSave = async (data: any) => {
        const coursData = { ...editerCourse, ...data, etudiants: selectedEtudiants.map(e => e.etudiant) };
        try {
            await api.put(`/cour/${data.name}`, coursData);
            Alert.alert("Succès", 'Mise à jours avec succès');
            navigation.goBack();
        } catch (error) {
            // console.error(`Erreur lors de editer de ${data.code_cours}`, error);
        }
    };

    const handleChange = (field: string, onChange: (value: string) => void) => (value: string) => {
        setEditerCourse(prevState => ({ ...prevState, [field]: value }));
        onChange(value);
    };

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: editerCourse
    });

    const renderPicker = (name: string, data: any[], modalKey: string) => (
        <View style={styles.pickerWrapper}>
            <Button mode='contained-tonal' style={{ backgroundColor: '#ffdab9' }} onPress={() => setModalVisible(prevState => ({ ...prevState, [modalKey]: true }))}>
                <Text style={styles.pickerText}>{editerCourse[modalKey] || `Choisir ${name}`}</Text>
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
                                        setEditerCourse(prevState => ({ ...prevState, [modalKey]: itemValue }));
                                        setModalVisible(prevState => ({ ...prevState, [modalKey]: false }));
                                    }} style={styles.picker}>
                                        <Picker.Item label="Aucun" value="" />
                                        {data.map((item, index) => (
                                            <Picker.Item key={item.id || index} label={item.name} value={item.name} />
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

    const handleStudentSelection = (etudiant: Etudiant) => {
        const isSelected = selectedEtudiants.some(s => s.etudiant === etudiant.etudiant);
        if (isSelected) {
            setSelectedEtudiants(prevSelected => prevSelected.filter(s => s.etudiant !== etudiant.etudiant));
        } else {
            setSelectedEtudiants(prevSelected => [...prevSelected, etudiant]);
        }
    };

    const renderStudentPicker = () => (
        <View style={styles.pickerWrapper}>
            <Button mode='contained-tonal' style={{ backgroundColor: '#ffdab9' }} onPress={() => setModalVisible(prevState => ({ ...prevState, etudiants: true }))}>
                <Text style={styles.pickerText}>{selectedEtudiants.length > 0 ? `Étudiants sélectionnés: ${selectedEtudiants.length}` : 'Choisir des Étudiants'}</Text>
            </Button>
            <Modal
                transparent={true}
                animationType="slide"
                visible={modalVisible.etudiants}
                onRequestClose={() => setModalVisible(prevState => ({ ...prevState, etudiants: false }))}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <ScrollView>
                            {data3.map((etudiant, index) => (
                                <View key={etudiant.id || index} style={styles.checkboxContainer}>
                                    <CheckBox
                                        label=''
                                        onChange={() => handleStudentSelection({ etudiant: etudiant.name })}
                                        checked={selectedEtudiants.some(s => s.etudiant === etudiant.name)}
                                    />
                                    <Text style={styles.checkboxLabel}>{etudiant.name}</Text>
                                </View>
                            ))}
                        </ScrollView>
                        <Button mode='elevated' style={{ backgroundColor: '#d3d3d3' }} onPress={() => {
                            setEditerCourse(prevState => ({ ...prevState, etudiants: selectedEtudiants }));
                            setModalVisible(prevState => ({ ...prevState, etudiants: false }));
                        }}>Fermer</Button>
                    </View>
                </View>
            </Modal>
        </View>
    );

    return (
        <ScrollView>
            <View style={styles.Background}>
                <Frame title={editerCourse?.name || '--'}>
                    <Controller
                        control={control}
                        name="code_cours"
                        render={({ field: { onChange, value } }) => (
                            <>
                                <TextInput
                                    value={value}
                                    label="Code cours"
                                    returnKeyType="next"
                                    autoCapitalize="none"
                                    onChangeText={handleChange('code_cours', onChange)}
                                    placeholder="Code cours"
                                    style={[errors.code_cours && styles.inputError]}
                                />
                                {errors.code_cours && <Text style={styles.errorText}>{errors.code_cours.message}</Text>}
                            </>
                        )}
                    />
                    <Controller
                        control={control}
                        name="ann_univ"
                        render={({ field: { onChange, value } }) => (
                            <>
                                <View style={styles.container}>
                                    <Text style={styles.label}>Année universitaire:</Text>
                                    <View style={styles.select}>
                                        <RNPickerSelect
                                            onValueChange={handleChange('ann_univ', onChange)}
                                            value={value}
                                            items={[
                                                { label: '2023/2024', value: '2023/2024' },
                                            ]}
                                            style={pickerSelectStyles}
                                            placeholder={{ label: "Sélectionnez une année", value: "" }}
                                        />
                                    </View>
                                </View>
                            </>
                        )}
                    />
                    <Text style={styles.label1}>Professeur:</Text>
                    {renderPicker('un Professeur', data, 'professor')}
                    <Text style={styles.label1}>Département:</Text>
                    {renderPicker('un Département', data2, 'department')}
                    <Text style={styles.label1}>Étudiants:</Text>
                    {renderStudentPicker()}
                </Frame>
                <Button mode="contained-tonal" style={{ backgroundColor: '#20B2AA' }} onPress={handleSubmit(handleSave)}>Enregistrer</Button>
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
        padding: 0,
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
    select: {
        backgroundColor: '#ffdab9',
        width: '100%',
        marginVertical: 10,
        fontWeight: 'bold',
        fontSize: 13,
        borderRadius: 20,
        lineHeight: 20,
    },
    inputError: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
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
    label1: {
        marginBottom: -30,
        marginTop: 30,
        fontSize: 13,
        marginLeft: 5,
        alignSelf: 'flex-start',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    checkboxLabel: {
        marginLeft: 8,
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
        borderColor: 'purple',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30,
    },
});

export default memo(UpdateCourseScreen);

