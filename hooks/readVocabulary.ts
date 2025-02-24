import { firestore } from "@/config/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export const readFirestoreVocabulary = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestore, "vocabularies"));
    
    querySnapshot.forEach((doc) => {
      // console.log(doc.id, " => ", doc.data().word);
    });

    console.log("Vocabulary read!");
    
    return querySnapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error("Error reading vocabulary:", error);
  }
};
