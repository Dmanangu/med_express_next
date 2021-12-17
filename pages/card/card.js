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
import data from "../../utils/data";
import axios from "axios";
import { useContext } from "react";
import { Store } from "../../utils/Store";
import { useRouter } from "next/router";

export default function ProductCard(props) {
  const router = useRouter();
  const { dispatch } = useContext(Store);
  const { products } = props;
  if (!products) {
    return <div>Product Not Found</div>;
  }
  const addToCartHandler = async () => {
    const { products } = await axios.get(`/api/products/${products._id}`);
    dispatch({ type: "CART_ADD_ITEM", payload: { ...products, quantity: 1 } });
    router.push("/cart");
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
