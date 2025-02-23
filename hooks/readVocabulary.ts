import { getFirestore } from "@/config/firebaseConfig";

export const readFirestoreVocabulary = async () => {
  try {
    const querySnapshot = await getFirestore().collection("vocabularies").get();
    querySnapshot.forEach((doc) => {
      // console.log(doc.id, " => ", doc.data().word);
    });
    console.log("Vocabulary read!");
    return querySnapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error("Error reading vocabulary:", error);
  }
};
