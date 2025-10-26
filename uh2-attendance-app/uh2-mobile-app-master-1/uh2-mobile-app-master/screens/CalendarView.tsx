import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Agenda } from 'react-native-calendars';
import moment from 'moment';
import api from '../ApiService';
import { AuthContext } from '../AuthContext';
import Button from '../components/Button';
import { Navigation } from './../types';
import Calendrier from './admin_screens/CalendrierScreen';

type Props = {
  route: {
    params: {
      Calendrier: {
        name: string;
        reference_doctype: string;
        subject_field: string;
        start_date_field: string;
        end_date_field: string;
      };
    };
  };
};

export interface Schedule {
  name: string;
  schedule_code: string;
  course: string;
  td: string;
  tp: string;
  start_datetime: string;
  end_datetime: string;
  location: string;
}

type Props2 = {
  navigation: Navigation;
};

const HomeScreen = ({ navigation, route }: Props & Props2) => {
  const { Calendrier } = route.params;
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedDate, setSelectedDate] = useState<{ date: string, schedules: Schedule[] } | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { userToken, verifyToken } = useContext(AuthContext);

  useEffect(() => {
    if (!userToken) {
      navigation.navigate("LoginScreen");
    } else {
      verifyToken();
      fetchData();
    }
  }, [userToken]);

  const fetchData = async () => {
    try {
      const response = await api.get('/schedules');
      if (response.data.data && Array.isArray(response.data.data)) {
        setSchedules(response.data.data);
      } else {
        console.error('Error fetching schedules: Response data is not an array', response.data.data);
      }
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  const handleSchedulePress = async (ScheduleId: string) => {
    try {
      const response = await api.get(`/schedule/${ScheduleId}`);
      navigation.navigate('Détail de Schedule', { Schedule: response.data.data });
    } catch (error) {
      console.error(`Error fetching ${ScheduleId}`, error);
    }
  };

  const formatSchedulesForAgenda = () => {
    const formattedSchedules: { [key: string]: any[] } = {};

    schedules.forEach(schedule => {
      const date = moment(schedule.start_datetime).format('YYYY-MM-DD');
      if (!formattedSchedules[date]) {
        formattedSchedules[date] = [];
      }
      formattedSchedules[date].push({
        name: schedule.name,
        schedule_code: schedule.schedule_code,
        course: schedule.course,
        td: schedule.td,
        tp: schedule.tp,
        start_datetime: schedule.start_datetime,
        end_datetime: schedule.end_datetime,
        location: schedule.location,
      });
    });

    return formattedSchedules;
  };

  const handleDayPress = (day) => {
    const selectedSchedules = schedules.filter(schedule =>
      moment(schedule.start_datetime).isSame(day.dateString, 'day')
    );
    setSelectedDate({ date: day.dateString, schedules: selectedSchedules });
  };

  const sujet = Calendrier.subject_field;

  return (
    <View style={styles.container}>
      <Agenda
        items={formatSchedulesForAgenda()}
        renderItem={(item, firstItemInDay) => (
          <View style={styles.item}>
            <Text style={styles.itemText1}>
              {(() => {
                switch (sujet) {
                  case 'course':
                    return item.course;
                  case 'td':
                    return item.td;
                  case 'tp':
                    return item.tp;
                  case 'location':
                    return item.location;
                  case 'start_datetime':
                    return item.start_datetime;
                  case 'end_datetime':
                    return item.end_datetime;
                  default:
                    return item.name;
                }
              })()}
            </Text>
            <Button mode='elevated' onPress={() => handleSchedulePress(item.name)}>
              <Text style={styles.itemText}>De {moment(item.start_datetime).format('HH:mm')} à {moment(item.end_datetime).format('HH:mm')}</Text>
            </Button>
          </View>
        )}
        rowHasChanged={(r1, r2) => r1.name !== r2.name}
        onDayPress={handleDayPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 1,
    width: '100%',
    opacity: 1,
    maxWidth: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  item: {
    backgroundColor: '#ffffff',
    flex: 1,
    borderRadius: 5,
    padding: 20,
    marginRight: 10,
    marginTop: 17,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  itemText: {
    alignSelf: 'center',
    fontSize: 10,
    color: '#333',
  },
  itemText1: {
    alignSelf: 'center',
    fontSize: 10,
    color: '#333',
  },
});

export default HomeScreen;
