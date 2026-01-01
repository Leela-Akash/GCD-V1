import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const createComplaint = async (data) => {
  await addDoc(collection(db, "complaints"), {
    ...data,
    status: "Submitted",
    createdAt: serverTimestamp()
  });
};
