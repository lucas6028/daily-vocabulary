import { firestore } from "@/config/firebaseConfig";
import { Vocabulary } from "@/types/types";
import { doc, updateDoc } from "firebase/firestore";

export const updateVocabulary = async (id: string, newData: Vocabulary) => {
  try {
    const docRef = doc(firestore, "vocabularies", id);
    await updateDoc(docRef, { ...newData } as any);
    console.log("Vocabulary updated!");
  } catch (error) {
    console.error("Error updating vocabulary:", error);
  }
};
