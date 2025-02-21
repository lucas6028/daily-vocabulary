import { firestore } from "@/config/firebaseConfig";
import { Vocabulary } from "@/types/types";

export const updateVocabulary = async (id: string, newData: Vocabulary) => {
  try {
    await firestore().collection("vocabularies").doc(id).update(newData);
    console.log("Vocabulary updated!");
  } catch (error) {
    console.error("Error updating vocabulary:", error);
  }
};
