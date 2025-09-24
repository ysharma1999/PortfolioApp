import { Ionicons } from '@expo/vector-icons';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { RootStackParamList } from '../../App';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { saveJournalEntry } from '../store/slice/journalSlice';
import { formatDate, getCurrentDateKey } from '../utils/dateUtils';

type JournalScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Journal'>;

interface Props {
  navigation: JournalScreenNavigationProp;
}

const JournalScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { journalEntries } = useAppSelector((state) => state.journal);
  const [currentEntry, setCurrentEntry] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const textInputRef = useRef<TextInput>(null);

  const todayKey = getCurrentDateKey();
  const todayEntry = journalEntries[todayKey];

  useEffect(() => {
    const existingContent = todayEntry?.content || '';
    setCurrentEntry(existingContent);
    setHasUnsavedChanges(false);
  }, [todayEntry]);

  const handleTextChange = (text: string) => {
    setCurrentEntry(text);
    const existingContent = todayEntry?.content || '';
    setHasUnsavedChanges(text !== existingContent);
  };

  const handleSave = () => {
    if (!currentEntry.trim()) {
      Alert.alert('Empty Entry', 'Please write something before saving.');
      return;
    }

    dispatch(saveJournalEntry({
      date: todayKey,
      content: currentEntry.trim(),
    }));

    setHasUnsavedChanges(false);
    Alert.alert('Saved!', 'Your journal entry has been saved successfully.');
  };

  const handleAutoSave = () => {
    if (hasUnsavedChanges && currentEntry.trim()) {
      dispatch(saveJournalEntry({
        date: todayKey,
        content: currentEntry.trim(),
      }));
      setHasUnsavedChanges(false);
    }
  };

  const getWordCount = () => {
    return currentEntry.trim().split(/\s+/).filter(word => word).length;
  };

  const getCharacterCount = () => {
    return currentEntry.length;
  };

 
  useEffect(() => {
    const interval = setInterval(handleAutoSave, 30000);
    return () => clearInterval(interval);
  }, [hasUnsavedChanges, currentEntry]);


  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (!hasUnsavedChanges) {
        return;
      }

      e.preventDefault();

      Alert.alert(
        'Discard changes?',
        'You have unsaved changes. Do you want to save them before leaving?',
        [
          { text: "Don't save", style: 'cancel', onPress: () => navigation.dispatch(e.data.action) },
          { text: 'Save', style: 'default', onPress: () => {
            handleAutoSave();
            navigation.dispatch(e.data.action);
          }},
        ]
      );
    });

    return unsubscribe;
  }, [navigation, hasUnsavedChanges]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Text style={styles.dateText}>{formatDate(new Date())}</Text>
          <View style={styles.headerStats}>
            <Text style={styles.statText}>{getWordCount()} words</Text>
            <Text style={styles.statText}>•</Text>
            <Text style={styles.statText}>{getCharacterCount()} chars</Text>
            {hasUnsavedChanges && (
              <View style={styles.unsavedIndicator}>
                <Ionicons name="ellipse" size={8} color="#fbbf24" />
                <Text style={styles.unsavedText}>Unsaved</Text>
              </View>
            )}
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.entryCard}>
            <TextInput
              ref={textInputRef}
              style={styles.textInput}
              multiline
              placeholder="How was your day? What insights did the stars bring you? Write about your thoughts, feelings, and experiences..."
              placeholderTextColor="#64748b"
              value={currentEntry}
              onChangeText={handleTextChange}
              textAlignVertical="top"
              autoCapitalize="sentences"
              autoCorrect
              scrollEnabled={false}
            />
          </View>

          {currentEntry.trim().length > 0 && (
            <TouchableOpacity
              style={[
                styles.saveButton,
                !hasUnsavedChanges && styles.saveButtonDisabled
              ]}
              onPress={handleSave}
              disabled={!hasUnsavedChanges}
            >
              <Ionicons 
                name="save" 
                size={20} 
                color={hasUnsavedChanges ? '#fff' : '#64748b'} 
              />
              <Text style={[
                styles.saveButtonText,
                !hasUnsavedChanges && styles.saveButtonTextDisabled
              ]}>
                {hasUnsavedChanges ? 'Save Entry' : 'Saved'}
              </Text>
            </TouchableOpacity>
          )}

          <PreviousEntries currentDate={todayKey} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Previous Entries Component
const PreviousEntries: React.FC<{ currentDate: string }> = ({ currentDate }) => {
  const { journalEntries } = useAppSelector((state) => state.journal);
  const [showHistory, setShowHistory] = useState(false);

  const getPreviousEntries = () => {
    return Object.entries(journalEntries)
      .filter(([date]) => date !== currentDate)
      .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
      .slice(0, 10);
  };

  const previousEntries = getPreviousEntries();

  if (previousEntries.length === 0) {
    return null;
  }

  return (
    <View style={styles.historyContainer}>
      <TouchableOpacity 
        style={styles.historyToggle}
        onPress={() => setShowHistory(!showHistory)}
      >
        <Text style={styles.historyToggleText}>
          Previous Entries ({previousEntries.length})
        </Text>
        <Ionicons 
          name={showHistory ? "chevron-down" : "chevron-up"} 
          size={20} 
          color="#94a3b8" 
        />
      </TouchableOpacity>

      {showHistory && (
        <ScrollView style={styles.historyList} showsVerticalScrollIndicator={false}>
          {previousEntries.map(([date, entry]) => (
            <View key={date} style={styles.historyItem}>
              <View style={styles.historyItemHeader}>
                <Text style={styles.historyDate}>
                  {formatDate(new Date(date))}
                </Text>
                <Text style={styles.historyWordCount}>
                  {entry.content.trim().split(/\s+/).filter(word => word).length} words
                </Text>
              </View>
              <Text style={styles.historyEntry} numberOfLines={3}>
                {entry.content}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  dateText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 8,
  },
  headerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statText: {
    fontSize: 14,
    color: '#94a3b8',
    marginRight: 8,
  },
  unsavedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  unsavedText: {
    fontSize: 12,
    color: '#fbbf24',
    marginLeft: 4,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  entryCard: {
    margin: 20,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    minHeight: 400,
    borderWidth: 1,
    borderColor: '#334155',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#f1f5f9',
    lineHeight: 24,
    textAlignVertical: 'top',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366f1',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  saveButtonDisabled: {
    backgroundColor: '#374151',
    elevation: 0,
    shadowOpacity: 0,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  saveButtonTextDisabled: {
    color: '#64748b',
  },
  historyContainer: {
    backgroundColor: '#1e293b',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  historyToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  historyToggleText: {
    fontSize: 16,
    color: '#94a3b8',
    fontWeight: '600',
  },
  historyList: {
    maxHeight: 300,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  historyItem: {
    backgroundColor: '#374151',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  historyItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyDate: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '600',
  },
  historyWordCount: {
    fontSize: 12,
    color: '#64748b',
  },
  historyEntry: {
    fontSize: 14,
    color: '#e2e8f0',
    lineHeight: 20,
  },
});

export default JournalScreen;
