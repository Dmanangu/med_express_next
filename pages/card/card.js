import {
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@material-ui/core";
import Layout from "../component/Layout";
import styles from "../styles/Home.module.css";
import data from "../utils/data";
import NextLink from "next/link";

export default function ProductCard() {
  const addToCartHandler = async () => {
    const { data } = await axios.get(`/api/products/${product._id}`);
    dispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity: 1 } });
  };
  return (
    <div>
      <Grid container spacing={3}>
        {data.products.map((products) => (
          <Grid item md={3} key={products.name}>
            <Card>
              <CardActionArea>
                <CardMedia
                  component="img"
                  image={products.image}
                  height={100}
                  width={200}
                  title={products.name}
                ></CardMedia>
                <CardContent>
                  <Typography>{products.name}</Typography>
                </CardContent>
                <CardContent>
                  <Typography>{products.genName}</Typography>
                </CardContent>
                <CardContent>
                  <Typography>{products.strength}</Typography>
                </CardContent>
                <CardContent>
                  <Typography>₱{products.price}</Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={addToCartHandler}
                >
                  ADD TO CART
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
