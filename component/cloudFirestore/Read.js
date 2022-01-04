import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const ReadToCloudFireStore = () => {
  const readData = async () => {
    const medicineList = [];
    try {
      const medicines = firebase.firestore().collection("medicine");
      const snapshot = await medicines.get();
      snapshot.forEach((doc) => {
        console.log(doc.id, "=>", doc.data());
        medicineList.push(doc.data());
      });
      console.log(medicineList);
      return medicineList;
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };
  return readData();
};

export default ReadToCloudFireStore;
