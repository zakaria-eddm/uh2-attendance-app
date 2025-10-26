import React, { memo, useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView ,Alert} from 'react-native';
import TextInput from '../../components/TextInput';
import Button from '../../components/Button';
import { useNavigation } from '@react-navigation/native';
import api from '../../ApiService';
import RNPickerSelect from 'react-native-picker-select';
import { Etudiant } from "../admin_screens/EtudiantScreen";
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { Navigation } from "../../types";
import { yupResolver } from '@hookform/resolvers/yup';
import { AuthContext } from '../../AuthContext';
import Frame from '../Frame';
const schema = yup.object().shape({
    name: yup.string(),
    cne: yup.string().required('CNE est nécessaire').min(3, 'Supérieur à 3 caractères').max(10, 'Inférieur à 10 caractères'),
    nom: yup.string().required('Nom est nécessaire'),
    prenom: yup.string().required('Prénom est nécessaire'),
    cin: yup.string().required('CIN est nécessaire'),
    univ_email: yup.string().email('Email incorrect').nullable(),
    perso_email: yup.string().email('Email incorrect').nullable(),
    semestre: yup.string().nullable(),
    cycle: yup.string().nullable(),
    filiere: yup.string().nullable(),
});
type Props1 = {
    navigation1: Navigation;
    route: {
        params: {
            Etudiant: Etudiant;
        };
    };
};
type Props = {
    navigation1: Navigation;
  };
const EtudiantAjouterScreen = ({navigation1 ,route}: Props & Props1) => {
    const navigation = useNavigation();
    const { userToken, verifyToken } = useContext(AuthContext);
    const { Etudiant } = route.params;
    const [editedEtudiant, seteditedEtudiant] = useState<Etudiant>(Etudiant);


    useEffect(() => {
        if (!userToken) navigation1.navigate("LoginScreen");
        verifyToken();
    }, []);

   
    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: editedEtudiant

    });
    const handleSave = async (data:Etudiant) => {
        try {
            await api.put(`/student/${data.name}`, data);
            Alert.alert("Succès",'Mise à jours avec succès');
            navigation.goBack();
        } catch (error) {
            // console.error(`Erreur lors de etider de ${data.name}`, error);
        }
    };

    return (
        <ScrollView>
            <View style={styles.Background}>
            <Frame title={editedEtudiant?.name || '--'}>
            <Controller
                    control={control}
                    name="cne"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <>
                            <TextInput
                                value={value}
                                label="CNE"
                                returnKeyType="next"
                                autoCapitalize="none"
                                // onBlur={onBlur}
                                onChangeText={onChange}
                                placeholder="CNE de l'étudiant"
                                style={[errors.cne && styles.inputError]}
                            />
                            {errors.cne && <Text style={styles.errorText}>{errors.cne.message}</Text>}
                        </>
                    )}
                />
         <Controller
                    control={control}
                    name="nom"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <>
                            <TextInput
                                value={value}
                                label="Nom"
                                returnKeyType="next"
                                autoCapitalize="none"
                                // onBlur={onBlur}
                                onChangeText={onChange}
                                placeholder="Nom de l'étudiant"
                                style={[errors.cne && styles.inputError]}
                            />
                            {errors.nom && <Text style={styles.errorText}>{errors.nom.message}</Text>}
                        </>
                    )}
                />

                <Controller
                    control={control}
                    name="prenom"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <>
                            <TextInput
                                value={value}
                                label="Prénom"
                                returnKeyType="next"
                                autoCapitalize="none"
                                // onBlur={onBlur}
                                onChangeText={onChange}
                                placeholder="Prénom de l'étudiant"
                                style={[errors.prenom && styles.inputError]}
                            />
                            {errors.prenom && <Text style={styles.errorText}>{errors.prenom.message}</Text>}
                        </>
                    )}
                />

                <Controller
                    control={control}
                    name="cin"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <>
                            <TextInput
                                value={value}
                                label="CIN"
                                returnKeyType="next"
                                autoCapitalize="none"
                                // onBlur={onBlur}
                                onChangeText={onChange}
                                placeholder="CIN de l'étudiant"
                                style={[errors.cin && styles.inputError]}
                            />
                            {errors.cin && <Text style={styles.errorText}>{errors.cin.message}</Text>}
                        </>
                    )}
                />

               <Controller
                    control={control}
                    name="cycle"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <>
                            <View style={styles.container}>
                                <Text style={styles.label}>Sélectionnez un cycle :</Text>
                                <View style={styles.select}>
                                <RNPickerSelect
                                    onValueChange={onChange}
                                    items={[
                                        { label: 'Licence fondamentale', value: 'Licence fondamentale' },
                                        { label: 'Master spécialisé', value: 'Master spécialisé' },
                                    ]}
                                    value={value}
                                    placeholder={{ label: "Sélectionnez un cycle", value: "" }}
                                    style={pickerSelectStyles}
                                />
                            </View>
                            </View>
                            {/* {errors.cycle && <Text style={styles.errorText}>{errors.cycle.message}</Text>} */}
                        </>
                        
                    )}
                />


                <Controller
                    control={control}
                    name="filiere"
                    render={({ field: { onChange, value } }) => (
                        <>
                            <View style={styles.container}>
                                <Text style={styles.label}>Sélectionnez une filière :</Text>
                                <View style={styles.select}>
                                <RNPickerSelect
                                    onValueChange={onChange}
                                    items={[
                                        { label: 'SMIA', value: 'SMIA' },
                                        { label: 'SMPC', value: 'SMPC' },
                                        { label: 'SVT', value: 'SVT' },
                                        { label: 'SMI', value: 'SMI' },
                                        { label: 'SMA', value: 'SMA' },
                                        { label: 'SMP', value: 'SMP' },
                                        { label: 'SMC', value: 'SMC' },
                                        { label: 'SV', value: 'SV' },
                                        { label: 'STU', value: 'STU' },
                                    ]}
                                    value={value}
                                    placeholder={{ label: "Sélectionnez une filière", value: "" }}
                                    style={pickerSelectStyles}
                                />
                            </View>
                            </View>
                            {/* {errors.filiere && <Text style={styles.errorText}>{errors.filiere.message}</Text>} */}
                        </>
                    )}
                />

                <Controller
                    control={control}
                    name="semestre"
                    render={({ field: { onChange, value } }) => (
                        <>
                            <View style={styles.container}>
                                <Text style={styles.label}>Sélectionnez un semestre :</Text>
                                <View style={styles.select}>
                                <RNPickerSelect
                                    onValueChange={onChange}
                                    items={[
                                        { label: 'S1', value: 'S1' },
                                        { label: 'S2', value: 'S2' },
                                        { label: 'S3', value: 'S3' },
                                        { label: 'S4', value: 'S4' },
                                        { label: 'S5', value: 'S5' },
                                        { label: 'S6', value: 'S6' },
                                    ]}
                                    value={value}
                                    placeholder={{ label: "Sélectionnez un semestre", value: "" }}
                                    style={pickerSelectStyles}
                                />
                            </View>
                            </View>
                            {/* {errors.semestre && <Text style={styles.errorText}>{errors.semestre.message}</Text>} */}
                        </>
                    )}
                />
                <Controller
                    control={control}
                    name="univ_email"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <>
                            <TextInput
                                value={value}
                                label="Email universitaire"
                                // onBlur={onBlur}
                                returnKeyType="next"
                                autoCapitalize="none"
                                onChangeText={onChange}
                                placeholder="Email universitaire"
                                style={[errors.univ_email && styles.inputError]}
                            />
                            {/* {errors.univ_email && <Text style={styles.errorText}>{errors.univ_email.message}</Text>} */}
                        </>
                    )}
                />
                 <Controller
                    control={control}
                    name="perso_email"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <>
                            <TextInput
                                value={value}
                                label="Email personnel"
                                // onBlur={onBlur}
                                returnKeyType="next"
                                autoCapitalize="none"
                                onChangeText={onChange}
                                placeholder="Email personnel"
                                style={[errors.perso_email && styles.inputError]}
                            />
                            {/* {errors.perso_email && <Text style={styles.errorText}>{errors.perso_email.message}</Text>} */}
                        </>
                    )}
                />
                 </Frame>
                <Button mode="contained-tonal" style={{ backgroundColor: '#20B2AA' }} onPress={handleSubmit(handleSave)}>Enregistrer</Button>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
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
    error: {
        color: 'red',
        marginBottom: 10,
    },
    inputError: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        alignSelf: 'flex-start',
    },
    select:{
        
        backgroundColor:'#00ffff',
        width: '100%',
        marginVertical: 10,
        fontWeight: 'bold',
        fontSize: 30,
        borderRadius:15,
        lineHeight: 26,

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
          borderColor: 'purple',
          borderRadius: 8,
          color: 'black',
          paddingRight: 30, 
        },
      });
    export default memo(EtudiantAjouterScreen);
    