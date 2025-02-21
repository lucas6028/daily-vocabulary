import { firestore } from "@/config/firebaseConfig";

export const deleteVocabulary = async (id: string) => {
  try {
    await firestore().collection("vocabularies").doc(id).delete();
    console.log("Vocabulary deleted!");
  } catch (error) {
    console.error("Error deleting vocabulary:", error);
  }
};
