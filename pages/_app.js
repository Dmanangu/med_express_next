import { SnackbarProvider } from "notistack";
import { useEffect } from "react";
import "../styles/globals.css";
import { StoreProvider } from "../utils/Store";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useUserData, useMedData } from "../lib/hooks";
import { UserContext, MedContext } from "../lib/context";

// added Auth Provider and AuthStateChanged

function MyApp({ Component, pageProps }) {
  const userData = useUserData();

  // const medicineData = useMedData();

  // console.log("SAAAAAAAAAAAAAAA");

  // console.log(medicineData);
  // console.log("SAAAAAAAAAAAAAAA");

  // const foo = medicineData.then((result) => result.data);

  // console.log('NNNNNNNNNNNNNNNNNNNNNNNNN');

  // console.log(Promise.resolve(medicineData).value);
  // console.log('NNNNNNNNNNNNNNNNNNNNNNNNNN');

  // await iAmAPromise.then(result => result.data);

  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);
  return (
    <UserContext.Provider value={userData}>
      {/*  <MedContext.Provider value={medicineData}> */}
      <SnackbarProvider
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <StoreProvider>
          <PayPalScriptProvider deferLoading={true}>
            {/* <AuthProvider>
            <AuthStateChanged> */}
            <Component {...pageProps} />
            {/* </AuthStateChanged>
          </AuthProvider> */}
          </PayPalScriptProvider>
        </StoreProvider>
      </SnackbarProvider>
      {/*    </MedContext.Provider> */}
    </UserContext.Provider>
  );
}

export default MyApp;
