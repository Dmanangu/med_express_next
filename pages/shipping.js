import React, { useContext } from "react";
import { useRouter } from "next/router";
import { Store } from "../utils/Store";
import Layout from "../component/Layout";
import { Typography } from "@material-ui/core";

export default function Shipping() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  if (userInfo) {
    router.push("/login?redirect=/shipping");
  }
  return (
    <Layout>
      <Typography variant="h1"> Shipping Page </Typography>
    </Layout>
  );
}
