import { firestore } from "@/config/firebaseConfig";

export const readFirestoreVocabulary = async () => {
  try {
    const querySnapshot = await firestore().collection("vocabularies").get();
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
    return querySnapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error("Error reading vocabulary:", error);
  }
};
