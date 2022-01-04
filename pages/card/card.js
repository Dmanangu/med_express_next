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
import axios from "axios";
import { useContext } from "react";
import { Store } from "../../utils/Store";
import { useRouter } from "next/router";

export default function ProductCard(props) {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { products } = props;
  if (!products) {
    return <div>Product Not Found</div>;
  }
  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find((x) => x._id === products._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${products._id}`);
    if (data.countInstock < quantity) {
      window.alert("Sorry. Product is Out of Stock");
      return;
    }
    dispatch({ type: "CART_ADD_ITEM", payload: { ...products, quantity } });
    router.push("/cart");
  };

  return (
    <div>
      <Grid container spacing={3}>
        {data.products.map((products) => (
          <Grid item md={3} key={products.prodName}>
            <Card>
              <CardActionArea>
                <CardMedia
                  component="img"
                  image={products.imageUrl}
                  height={100}
                  width={200}
                  title={products.prodName}
                ></CardMedia>
                <CardContent>
                  <Typography>{products.prodName}</Typography>
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
                  onClick={() => addToCartHandler(products)}
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
