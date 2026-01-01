import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "./firebase";

const storage = getStorage(app);

export async function uploadMedia(files, complaintId) {
  const urls = [];

  for (const file of files) {
    const fileRef = ref(
      storage,
      `complaints/${complaintId}/${Date.now()}_${file.name}`
    );

    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);

    urls.push({
      url,
      type: file.type
    });
  }

  return urls;
}

