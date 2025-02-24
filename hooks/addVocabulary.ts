import { firestore } from "@/config/firebaseConfig";
import { Vocabulary } from "@/types/types";
import { collection, doc, setDoc } from "firebase/firestore";

export const addFirestoreVocabulary = async (newData: Vocabulary, id: string) => {
  try {
   // Reference to the "vocabularies" collection with the custom document ID
   const docRef = doc(collection(firestore, "vocabularies"), id);
    
   // Set the data to the specified document
   await setDoc(docRef, newData);
    console.log("Vocabulary added!");
  } catch (error) {
    console.error("Error adding vocabulary:", error);
  }
};
