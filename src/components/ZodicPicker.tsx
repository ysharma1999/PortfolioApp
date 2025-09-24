import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchHoroscope, setZodiacSign } from '../store/slice/journalSlice';
import { ZodiacSign } from '../types';
import { ZODIAC_NAMES, ZODIAC_SIGNS, ZODIAC_SYMBOLS } from '../utils/constants';

const { width } = Dimensions.get('window');

const ZodiacPicker: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const selectedZodiac = useAppSelector(state => state.journal.selectedZodiac);
  const dispatch = useAppDispatch();

  const handleZodiacSelect = (zodiac: ZodiacSign) => {
    dispatch(setZodiacSign(zodiac));
    dispatch(fetchHoroscope(zodiac));
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.pickerButton}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <View style={styles.selectedZodiac}>
          <Text style={styles.zodiacSymbol}>
            {ZODIAC_SYMBOLS[selectedZodiac]}
          </Text>
          <Text style={styles.zodiacName}>
            {ZODIAC_NAMES[selectedZodiac]}
          </Text>
        </View>
        <Ionicons name="chevron-down" size={24} color="#94a3b8" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose Your Zodiac Sign</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.zodiacList} showsVerticalScrollIndicator={false}>
              {ZODIAC_SIGNS.map((zodiac) => (
                <TouchableOpacity
                  key={zodiac}
                  style={[
                    styles.zodiacItem,
                    selectedZodiac === zodiac && styles.selectedItem,
                  ]}
                  onPress={() => handleZodiacSelect(zodiac)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.itemSymbol}>
                    {ZODIAC_SYMBOLS[zodiac]}
                  </Text>
                  <Text style={[
                    styles.itemName,
                    selectedZodiac === zodiac && styles.selectedItemText,
                  ]}>
                    {ZODIAC_NAMES[zodiac]}
                  </Text>
                  {selectedZodiac === zodiac && (
                    <Ionicons name="checkmark" size={20} color="#6366f1" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 10,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  selectedZodiac: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  zodiacSymbol: {
    fontSize: 24,
    marginRight: 12,
  },
  zodiacName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f1f5f9',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#1e293b',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f1f5f9',
  },
  closeButton: {
    padding: 4,
  },
  zodiacList: {
    padding: 20,
  },
  zodiacItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
    backgroundColor: '#374151',
    borderRadius: 12,
  },
  selectedItem: {
    backgroundColor: '#6366f1',
  },
  itemSymbol: {
    fontSize: 24,
    marginRight: 16,
  },
  itemName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#e2e8f0',
  },
  selectedItemText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default ZodiacPicker;
