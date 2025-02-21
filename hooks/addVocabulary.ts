import { firestore } from "@/config/firebaseConfig";
import { Vocabulary } from "@/types/types";

export const addFirestoreVocabulary = async (newData: Vocabulary) => {
  try {
    await firestore().collection("vocabularies").add(newData);
    console.log("Vocabulary added!");
  } catch (error) {
    console.error("Error adding vocabulary:", error);
  }
};
