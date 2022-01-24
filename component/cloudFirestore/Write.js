import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { auth } from "../lib/firebase";

const WriteToCloudFireStore = () => {
  const sendData = (fullname, address, barangay, phone, city) => {
    try {
      firebase
        .firestore()
        .collection("shippingAddress")
        .doc(auth.currentUser.uid)
        .set({
          fullName: fullname,
          address: address,
          barangay: barangay,
          phone: phone,
          city: city,
        })
        .then(alert("Data was successfully sent to cloud firestore!"));
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };
  return <button onClick={sendData}>Send Data to Cloud Firestore</button>;
};

export default WriteToCloudFireStore;
