import { firestore } from "@/config/firebaseConfig";
import { Vocabulary } from "@/types/types";
import { collection, addDoc } from "firebase/firestore";

export const addFirestoreVocabulary = async (newData: Vocabulary) => {
  try {
    await addDoc(collection(firestore, "vocabularies"), newData);
    console.log("Vocabulary added!");
  } catch (error) {
    console.error("Error adding vocabulary:", error);
  }
};
