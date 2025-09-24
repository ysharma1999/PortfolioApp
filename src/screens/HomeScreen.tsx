import { Ionicons } from '@expo/vector-icons';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { RootStackParamList } from '../../App';
import ZodiacPicker from '../components/ZodicPicker';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { clearError, fetchHoroscope } from '../store/slice/journalSlice';
import { formatDate, getCurrentDateKey } from '../utils/dateUtils';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const {
    selectedZodiac,
    currentHoroscope,
    loading,
    error,
    journalEntries,
  } = useAppSelector((state) => state.journal);

  const todayEntry = journalEntries[getCurrentDateKey()];

  useEffect(() => {
    if (!currentHoroscope) {
      dispatch(fetchHoroscope(selectedZodiac));
    }
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [
        {
          text: 'OK',
          onPress: () => dispatch(clearError()),
        },
      ]);
    }
  }, [error]);

  const handleRefresh = () => {
    dispatch(fetchHoroscope(selectedZodiac));
  };

  const navigateToJournal = () => {
    navigation.navigate('Journal');
  };

  const getTotalEntries = () => {
    return Object.keys(journalEntries).length;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.dateText}>{formatDate(new Date())}</Text>
          <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
            <Ionicons name="refresh" size={24} color="#6366f1" />
          </TouchableOpacity>
        </View>

        <ZodiacPicker />

        <View style={styles.horoscopeCard}>
          <View style={styles.horoscopeHeader}>
            <Ionicons name="star" size={24} color="#fbbf24" />
            <Text style={styles.horoscopeTitle}>
              Today's Horoscope
            </Text>
          </View>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6366f1" />
              <Text style={styles.loadingText}>Reading the stars...</Text>
            </View>
          ) : (
            <Text style={styles.horoscopeText}>
              {currentHoroscope || 'No horoscope available. Please try refreshing.'}
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.journalButton}
          onPress={navigateToJournal}
          activeOpacity={0.8}
        >
          <Ionicons name="create" size={24} color="#fff" />
          <View style={styles.journalButtonContent}>
            <Text style={styles.journalButtonText}>
              {todayEntry ? 'Continue Writing' : 'Write in Journal'}
            </Text>
            {todayEntry && (
              <Text style={styles.journalButtonSubtext}>
                Last updated: {new Date(todayEntry.updatedAt).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Text>
            )}
          </View>
          <Ionicons name="arrow-forward" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Ionicons name="book" size={20} color="#6366f1" />
            <Text style={styles.statNumber}>{getTotalEntries()}</Text>
            <Text style={styles.statLabel}>Journal Entries</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Ionicons name="calendar" size={20} color="#10b981" />
            <Text style={styles.statNumber}>
              {todayEntry ? '1' : '0'}
            </Text>
            <Text style={styles.statLabel}>Today's Entry</Text>
          </View>
        </View>

        <View style={styles.motivationCard}>
          <Ionicons name="heart" size={16} color="#f59e0b" />
          <Text style={styles.motivationText}>
            "The stars impel, they do not compel. Your journal is where destiny meets free will."
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e2e8f0',
  },
  refreshButton: {
    padding: 8,
  },
  horoscopeCard: {
    margin: 20,
    padding: 20,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  horoscopeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  horoscopeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f1f5f9',
    marginLeft: 12,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 12,
    color: '#94a3b8',
    fontSize: 16,
  },
  horoscopeText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#e2e8f0',
    textAlign: 'center',
  },
  journalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366f1',
    marginHorizontal: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    marginBottom: 20,
  },
  journalButtonContent: {
    flex: 1,
    marginLeft: 12,
  },
  journalButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  journalButtonSubtext: {
    color: '#e0e7ff',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    marginHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  divider: {
    width: 1,
    backgroundColor: '#334155',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f1f5f9',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
    textAlign: 'center',
  },
  motivationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    padding: 16,
    backgroundColor: '#374151',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#fbbf24',
  },
  motivationText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#d1d5db',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
});

export default HomeScreen;
