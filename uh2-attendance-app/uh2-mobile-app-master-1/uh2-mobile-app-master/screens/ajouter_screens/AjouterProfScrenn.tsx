import React, { memo, useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal ,Alert } from 'react-native';
import TextInput from '../../components/TextInput';
import Button from '../../components/Button';
import { useNavigation } from '@react-navigation/native';
import api from '../../ApiService';
import { Navigation } from "../../types";
import { Professeur } from "../admin_screens/ProfesseurScreen";
import * as yup from 'yup';
import { AuthContext } from '../../AuthContext';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import { Picker } from '@react-native-picker/picker';
import Frame from '../Frame';
type Props = {
    navigation1: Navigation;
};

const schema = yup.object().shape({
    //name: yup.string().required('Le nom est obligatoire'),
    full_name: yup.string().required('Nom complet est nécessaire'),
    nom: yup.string().nullable(),
    prenom: yup.string().nullable(),
    cin: yup.string().nullable(),
    univ_email: yup.string().email('Email universitaire incorrect').nullable(),
    perso_email: yup.string().email('Email personnel incorrect').nullable(),
    department: yup.string().nullable(),
});

const ProfesseurAjouterScreen = ({ navigation1 }: Props) => {
    const navigation = useNavigation();
    const { userToken, verifyToken } = useContext(AuthContext);
    const [ajouterProfesseur, setAjouterProfesseur] = useState<Partial<Professeur>>({});
    const [data, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState({ department: false });
    useEffect(() => {
        if (!userToken) navigation1.navigate("LoginScreen");
        verifyToken();

        const fetchData = async () => {
            try {
                const response1 = await api.get(`/departements`);
                setData(response1.data.data);
            } catch (error) {
                // console.error('Error fetching data', error);
            }
        };
        fetchData();
    }, []);
    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const handleSave = async (data: any) => {
        const professeurData = { ...ajouterProfesseur, ...data };
        try {
            await api.post(`/professeur`, professeurData);
            Alert.alert("Succès",'l\'ajout avec succès');
            navigation.goBack();
        } catch (error) {
            // console.error(`Erreur lors de l'ajout de ${professeurData.name}`, error);
        }
    };
    const renderPicker = (name: string, data: any[], modalKey: string) => (
        <View style={styles.pickerWrapper}>
            <Button  mode='contained-tonal'style={{backgroundColor:'#ffdab9'}} onPress={() => setModalVisible(prevState => ({ ...prevState, [modalKey]: true }))}>
                <Text style={{fontSize:13}}>{ajouterProfesseur[modalKey] || `Choisir ${name}`}</Text>
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
                                        setAjouterProfesseur({ ...ajouterProfesseur, [modalKey]: itemValue });
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
            <Frame title='Nouveau(elle) Professor'>
                <Controller
                    control={control}
                    name="full_name"
                    render={({ field: { onChange, value } }) => (
                        <>
                            <TextInput
                                // autoCapitalize="none"
                                label="Nom complet"
                                returnKeyType="next"
                                onChangeText={( onChange)}
                                placeholder="Nom complet"
                                value={value}
                            />
                            {errors.full_name && <Text style={styles.errorText}>{errors.full_name.message}</Text>}
                        </>
                    )}
                />
                <Controller
                    control={control}
                    name="nom"
                    render={({ field: { onChange, value } }) => (
                        <>
                            <TextInput
                                // autoCapitalize="none"
                                label="Nom"
                                returnKeyType="next"
                                onChangeText={(onChange)}
                                placeholder="Nom"
                                value={value}
                            />
                            {errors.nom && <Text style={styles.error}>{errors.nom.message}</Text>}
                        </>
                    )}
                />
                <Controller
                    control={control}
                    name="prenom"
                    render={({ field: { onChange, value } }) => (
                        <>
                            <TextInput
                                // autoCapitalize="none"
                                label="Prénom"
                                returnKeyType="next"
                                onChangeText={( onChange)}
                                placeholder="Prénom"
                                value={value}
                            />
                            {errors.prenom && <Text style={styles.error}>{errors.prenom.message}</Text>}
                        </>
                    )}
                />
                <Controller
                    control={control}
                    name="cin"
                    render={({ field: { onChange, value } }) => (
                        <>
                            <TextInput
                                // autoCapitalize="none"
                                label="CIN"
                                returnKeyType="next"
                                onChangeText={( onChange)}
                                placeholder="CIN du professeur"
                                value={value}
                            />
                            {errors.cin && <Text style={styles.error}>{errors.cin.message}</Text>}
                        </>
                    )}
                />
                 {renderPicker('un department', data, 'department')}
                <Controller
                    control={control}
                    name="univ_email"
                    render={({ field: { onChange, value } }) => (
                        <>
                            <TextInput
                                // autoCapitalize="none"
                                label="Email universitaire"
                                returnKeyType="next"
                                onChangeText={( onChange)}
                                placeholder="Email universitaire"
                                value={value}
                            />
                            {errors.univ_email && <Text style={styles.error}>{errors.univ_email.message}</Text>}
                        </>
                    )}
                />
                <Controller
                    control={control}
                    name="perso_email"
                    render={({ field: { onChange, value } }) => (
                        <>
                            <TextInput
                                // autoCapitalize="none"
                                label="Email personnel"
                                returnKeyType="next"
                                onChangeText={( onChange)}
                                placeholder="Email personnel"
                                value={value}
                            />
                            {errors.perso_email && <Text style={styles.error}>{errors.perso_email.message}</Text>}
                        </>
                    )}
                />
                  </Frame>
                <Button  mode="contained-tonal" style={{ backgroundColor: '#20B2AA' }} onPress={handleSubmit(handleSave)}>Enregistrer</Button>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    background: {
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
    error: {
        color: 'red',
        marginBottom: 10,
        alignSelf: 'flex-start',
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
        alignSelf: 'flex-start',
    },
    errorText: {
        color: '#ff4500',
        alignSelf: 'flex-start',
    },
    datetimeText: {
        marginBottom: 10,
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

export default memo(ProfesseurAjouterScreen);
