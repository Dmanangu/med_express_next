import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const WriteToCloudFireStore = () => {
  const sendData = () => {
    try {
      firebase
        .firestore()
        .collection("users")
        .doc("users")
        .set({
          displayName: "Robin",
          email: "Robin@gmail.com",
          tel: "+639454122501",
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
