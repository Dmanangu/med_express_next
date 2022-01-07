import React from "react";
import { useRouter } from "next/router";
import NextLink from "next/link";
import Image from "next/image";
import { Grid, Link } from "@material-ui/core";
import data from "../../utils/data";
import Layout from "../../component/Layout";
import useStyles from "../../utils/style";

export default function ProductScreen() {
  const classes = useStyles();
  const router = useRouter();
  const { slug } = router.query;
  const product = data.products.find((a) => a.slug === slug);
  if (!product) {
    return <div> Product Not Found </div>;
  }
  return (
    <Layout title={product.name}>
      <div className={classes.section}>
        <NextLink href="/" passHref>
          <Link>Back To Products</Link>
        </NextLink>
      </div>
      <Grid container spacing={1}>
        <Grid item md={6} xs={12}>
          <Image
            src={product.image}
            width={640}
            height={640}
            layout="responsive"
            alt="NO Image"
          ></Image>
        </Grid>
      </Grid>
    </Layout>
  );
}
