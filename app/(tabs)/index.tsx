import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  useColorScheme,
  Alert,
} from 'react-native';
import { MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addFirestoreVocabulary } from '@/hooks/addVocabulary';
import { readFirestoreVocabulary } from '@/hooks/readVocabulary';
import { Vocabulary } from '@/types/types';
import { styles } from '../../styles/HomeScreenStyle';

const levels = ['Beginner', 'Intermediate', 'Advanced'];

// Configure spacing intervals based on Ebbinghaus' forgetting curve (in days)
const forgettingCurveIntervals = [1, 2, 5, 12, 20, 50];

export default function HomeScreen() {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);
  const [activeTab, setActiveTab] = useState('list');
  const [filterLevel, setFilterLevel] = useState('All');
  const [newWord, setNewWord] = useState({
    word: '',
    definition: '',
    example: '',
    level: 'Beginner',
    imagePrompt: ''
  });
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewProgress, setReviewProgress] = useState({ completed: 0, total: 0 });

  const todayDate = new Date();
  const today = todayDate.toISOString().split('T')[0];

  // Theme settings
  const theme = {
    background: isDarkMode ? '#1a1a1a' : '#f8f9fa',
    card: isDarkMode ? '#2d2d2d' : '#ffffff',
    cardGradient: isDarkMode ? ['#2d2d2d', '#252525'] : ['#ffffff', '#f8f9fa'],
    text: isDarkMode ? '#e1e1e1' : '#212529',
    subtext: isDarkMode ? '#b0b0b0' : '#6c757d',
    border: isDarkMode ? '#404040' : '#dee2e6',
    primary: isDarkMode ? '#0a84ff' : '#007AFF',
    secondary: isDarkMode ? '#2d2d2d' : '#e9ecef',
    input: isDarkMode ? '#333333' : 'white',
    success: isDarkMode ? '#50C878' : '#28a745',
    warning: isDarkMode ? '#FFA500' : '#ffc107',
  };

  if (typeof setImmediate === 'undefined') {
    global.setImmediate = (callback) => setTimeout(callback, 0);
  }

  // Initialize and load data
  useEffect(() => {
    const loadVocabularies = async () => {
      try {
        const storedVocabularies = await readFirestoreVocabulary();
        if (storedVocabularies) {
          const vocabulariesData: Vocabulary[] = storedVocabularies.map((doc: any) => ({
            id: doc.id,
            word: doc.word,
            definition: doc.definition,
            example: doc.example,
            level: doc.level,
            imagePrompt: doc.imagePrompt,
            dateAdded: doc.dateAdded,
            reviewSchedule: doc.reviewSchedule,
            lastReviewed: doc.lastReviewed,
            reviewHistory: doc.reviewHistory,
          }));
          setVocabularies(vocabulariesData);
        }
      } catch (e) {
        console.error('Failed to load vocabularies', e);
      }
    };

    loadVocabularies();
  }, []);

  // Calculate review progress whenever vocabularies change
  useEffect(() => {
    const vocabsDueToday = vocabularies.filter(vocab =>
      vocab.reviewSchedule?.some(schedule => schedule.date === today && !schedule.completed)
    );

    const completedToday = vocabularies.filter(vocab =>
      vocab.reviewSchedule?.some(schedule => schedule.date === today && schedule.completed)
    );

    setReviewProgress({
      completed: completedToday.length,
      total: vocabsDueToday.length + completedToday.length
    });
  }, [vocabularies]);

  // Get vocabularies due for review today
  const vocabsDueForReview = vocabularies.filter(vocab =>
    vocab.reviewSchedule?.some(schedule => schedule.date === today && !schedule.completed)
  );

  // Filter vocabularies by level
  const filteredVocabularies = vocabularies.filter(
    (vocab) => filterLevel === 'All' || vocab.level === filterLevel
  );

  // Calculate review due date for displayed vocabularies
  const getNextReviewDate = (vocab: Vocabulary) => {
    const pendingReviews = vocab.reviewSchedule?.filter(schedule => !schedule.completed) || [];
    if (pendingReviews.length > 0) {
      return new Date(pendingReviews[0].date); // Convert review date string to Date object
    }
    return null;
  };

  // Check if vocabulary is due for review today
  const isDueToday = (vocab: Vocabulary) => {
    return vocab.reviewSchedule?.some(schedule => schedule.date === today && !schedule.completed) || false;
  };

  // Mark a vocabulary as reviewed
  const markAsReviewed = (id: string) => {
    setVocabularies(prevVocabs =>
      prevVocabs.map(vocab => {
        if (vocab.id === id) {
          // Update the review schedule
          const updatedSchedule = vocab.reviewSchedule.map(schedule => {
            if (schedule.date === today) {
              return { ...schedule, completed: true };
            }
            return schedule;
          });

          return {
            ...vocab,
            reviewSchedule: updatedSchedule,
            lastReviewed: today,
            reviewHistory: [...vocab.reviewHistory || [], today]
          };
        }
        return vocab;
      })
    );
  };

  // Create review schedule for a new vocabulary
  const createReviewSchedule = () => {
    const schedule = [];
    let currentDate = new Date();

    for (const interval of forgettingCurveIntervals) {
      const reviewDate = new Date(currentDate);
      reviewDate.setDate(reviewDate.getDate() + interval);
      schedule.push({
        date: reviewDate.toISOString().split('T')[0],
        completed: false
      });
      currentDate = reviewDate;
    }

    return schedule;
  };

  // Add new vocabulary
  const addVocabulary = () => {
    if (newWord.word && newWord.definition) {
      const newVocab = {
        id: Date.now().toString(),
        ...newWord,
        dateAdded: new Date().toISOString().split('T')[0],
        imagePrompt: newWord.imagePrompt || `conceptual visualization of ${newWord.word}`,
        reviewSchedule: createReviewSchedule(),
        lastReviewed: null,
        reviewHistory: []
      };
      setVocabularies((prev) => [...prev, newVocab]);
      addFirestoreVocabulary(newVocab);

      setNewWord({
        word: '',
        definition: '',
        example: '',
        level: 'Beginner',
        imagePrompt: ''
      });
      setActiveTab('list');
    }
  };

  // Show review summary
  const showReviewSummary = () => {
    Alert.alert(
      'Today\'s Review Progress',
      `Completed: ${reviewProgress.completed} of ${reviewProgress.total}`,
      [{ text: 'OK' }]
    );
  };

  // VocabularyCard component
  const VocabularyCard = ({ item, showReviewButton = false }: { item: Vocabulary, showReviewButton?: boolean }) => {
    const nextReviewDate = getNextReviewDate(item);
    const isOverdue = nextReviewDate && nextReviewDate < todayDate; // Compare Date objects

    const reviewStatus = isDueToday(item) ? 'Due Today' :
      isOverdue ? 'Overdue' :
        item.lastReviewed === today ? 'Reviewed Today' :
          nextReviewDate ? `Next: ${nextReviewDate.toISOString().split('T')[0]}` : 'All Reviews Complete'; // Format Date for display

    const statusColor = isDueToday(item) || isOverdue ? theme.warning :
      item.lastReviewed === today ? theme.success : theme.subtext;

    return (
      <TouchableOpacity style={[styles.card, { backgroundColor: theme.card }]} activeOpacity={0.9}>
        <LinearGradient colors={theme.cardGradient} style={styles.cardGradient}>
          <View style={styles.cardHeader}>
            <Text style={[styles.word, { color: theme.text }]}>{item.word}</Text>
            <View style={[styles.levelBadge, { backgroundColor: theme.secondary }]}>
              <Text style={[styles.levelText, { color: theme.subtext }]}>{item.level}</Text>
            </View>
          </View>

          <Image
            source={{
              uri: `https://api.a0.dev/assets/image?text=${encodeURIComponent(
                item.imagePrompt
              )}&aspect=16:9`
            }}
            style={styles.wordImage}
          />

          <Text style={[styles.definition, { color: theme.text }]}>{item.definition}</Text>

          {item.example && (
            <View style={[styles.exampleContainer, { backgroundColor: theme.secondary }]}>
              <Text style={[styles.exampleLabel, { color: theme.subtext }]}>Example:</Text>
              <Text style={[styles.example, { color: theme.text }]}>{item.example}</Text>
            </View>
          )}

          <View style={styles.cardFooter}>
            <View style={styles.dateContainer}>
              <MaterialIcons name="calendar-today" size={16} color={theme.subtext} />
              <Text style={[styles.dateText, { color: theme.subtext }]}>Added: {item.dateAdded}</Text>
            </View>

            <View style={styles.statusContainer}>
              <MaterialIcons name="access-time" size={16} color={statusColor} />
              <Text style={[styles.statusText, { color: statusColor }]}>{reviewStatus}</Text>
            </View>
          </View>

          {showReviewButton && isDueToday(item) && (
            <TouchableOpacity
              style={[styles.reviewButton, { backgroundColor: theme.primary }]}
              onPress={() => markAsReviewed(item.id)}
            >
              <Text style={styles.reviewButtonText}>Mark as Reviewed</Text>
            </TouchableOpacity>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <View style={styles.headerLeft}>
          <Text style={[styles.title, { color: theme.text }]}>Vocabulary</Text>
          <TouchableOpacity style={styles.themeToggle} onPress={() => setIsDarkMode(!isDarkMode)}>
            <Ionicons name={isDarkMode ? 'sunny' : 'moon'} size={20} color={theme.subtext} />
          </TouchableOpacity>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[styles.progressButton, { backgroundColor: theme.secondary }]}
            onPress={showReviewSummary}
          >
            <Text style={[styles.progressText, { color: theme.subtext }]}>
              {reviewProgress.completed}/{reviewProgress.total}
            </Text>
          </TouchableOpacity>
          <View style={[styles.tabs, { backgroundColor: theme.secondary }]}>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'list' && styles.activeTab,
                { backgroundColor: activeTab === 'list' ? theme.card : 'transparent' }
              ]}
              onPress={() => {
                setActiveTab('list');
                setReviewMode(false);
              }}
            >
              <Ionicons name="list" size={20} color={activeTab === 'list' ? theme.primary : theme.subtext} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'review' && styles.activeTab,
                { backgroundColor: activeTab === 'review' ? theme.card : 'transparent' }
              ]}
              onPress={() => {
                setActiveTab('review');
                setReviewMode(true);
              }}
            >
              <Feather name="check-circle" size={18} color={activeTab === 'review' ? theme.primary : theme.subtext} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'add' && styles.activeTab,
                { backgroundColor: activeTab === 'add' ? theme.card : 'transparent' }
              ]}
              onPress={() => {
                setActiveTab('add');
                setReviewMode(false);
              }}
            >
              <Ionicons name="add" size={20} color={activeTab === 'add' ? theme.primary : theme.subtext} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {activeTab === 'list' && (
        <View style={styles.content}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            <TouchableOpacity
              style={[
                styles.filterChip,
                {
                  backgroundColor: filterLevel === 'All' ? theme.primary : theme.card,
                  borderColor: theme.border
                }
              ]}
              onPress={() => setFilterLevel('All')}
            >
              <Text style={[styles.filterText, { color: filterLevel === 'All' ? 'white' : theme.subtext }]}>
                All
              </Text>
            </TouchableOpacity>
            {levels.map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: filterLevel === level ? theme.primary : theme.card,
                    borderColor: theme.border
                  }
                ]}
                onPress={() => setFilterLevel(level)}
              >
                <Text style={[styles.filterText, { color: filterLevel === level ? 'white' : theme.subtext }]}>
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <ScrollView style={styles.list}>
            {filteredVocabularies.map((item) => (
              <VocabularyCard key={item.id} item={item} />
            ))}
          </ScrollView>
        </View>
      )}

      {activeTab === 'review' && (
        <View style={styles.content}>
          <View style={styles.reviewHeader}>
            <Text style={[styles.reviewTitle, { color: theme.text }]}>
              Today's Review ({vocabsDueForReview.length} words)
            </Text>
          </View>

          <ScrollView style={styles.list}>
            {vocabsDueForReview.length > 0 ? (
              vocabsDueForReview.map((item) => (
                <VocabularyCard key={item.id} item={item} showReviewButton={true} />
              ))
            ) : (
              <View style={styles.emptyReviewContainer}>
                <Ionicons name="checkmark-circle" size={64} color={theme.success} />
                <Text style={[styles.emptyReviewText, { color: theme.text }]}>
                  All caught up! No words to review today.
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      )}

      {activeTab === 'add' && (
        <ScrollView style={styles.addForm}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.input,
                borderColor: theme.border,
                color: theme.text
              }
            ]}
            placeholder="Word"
            placeholderTextColor={theme.subtext}
            value={newWord.word}
            onChangeText={(text) => setNewWord((prev) => ({ ...prev, word: text }))}
          />
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              {
                backgroundColor: theme.input,
                borderColor: theme.border,
                color: theme.text
              }
            ]}
            placeholder="Definition"
            placeholderTextColor={theme.subtext}
            multiline
            value={newWord.definition}
            onChangeText={(text) => setNewWord((prev) => ({ ...prev, definition: text }))}
          />
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              {
                backgroundColor: theme.input,
                borderColor: theme.border,
                color: theme.text
              }
            ]}
            placeholder="Example (optional)"
            placeholderTextColor={theme.subtext}
            multiline
            value={newWord.example}
            onChangeText={(text) => setNewWord((prev) => ({ ...prev, example: text }))}
          />
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.input,
                borderColor: theme.border,
                color: theme.text
              }
            ]}
            placeholder="Image Prompt (optional)"
            placeholderTextColor={theme.subtext}
            value={newWord.imagePrompt}
            onChangeText={(text) => setNewWord((prev) => ({ ...prev, imagePrompt: text }))}
          />
          <Text style={[styles.labelText, { color: theme.text }]}>Select Level:</Text>
          <View style={styles.levelSelector}>
            {levels.map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.levelOption,
                  {
                    backgroundColor: theme.input,
                    borderColor: theme.border
                  },
                  newWord.level === level && [styles.selectedLevel, { backgroundColor: theme.primary }]
                ]}
                onPress={() => setNewWord((prev) => ({ ...prev, level }))}
              >
                <Text
                  style={[
                    styles.levelOptionText,
                    { color: theme.subtext },
                    newWord.level === level && styles.selectedLevelText
                  ]}
                >
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: theme.primary }]}
            onPress={addVocabulary}
          >
            <Text style={styles.addButtonText}>Add Vocabulary</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}

