import { firestore } from "@/config/firebaseConfig";

export const addFirestoreVocabulary = async () => {
  try {
    await firestore().collection("vocabularies").add({
        id: '1',
        word: 'Serendipity',
        definition: 'The occurrence and development of events by chance in a happy or beneficial way',
        example: 'Finding your dream job while helping a stranger was pure serendipity',
        level: 'Advanced',
        dateAdded: '2025-02-17',
        imagePrompt: 'magical coincidence rainbow butterfly effect',
        reviewSchedule: [
          { date: '2025-02-18', completed: false },
          { date: '2025-02-19', completed: true },
          { date: '2025-02-20', completed: false },
          { date: '2025-02-21', completed: false },
          { date: '2025-02-22', completed: false },
          { date: '2025-02-23', completed: false },
        ],
        lastReviewed: '2024-02-18',
        reviewHistory: ['2024-02-16', '2024-02-18'],
    });
    console.log("Vocabulary added!");
  } catch (error) {
    console.error("Error adding vocabulary:", error);
  }
};
