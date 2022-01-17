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
// import axios from "axios";
import { useContext } from "react";
import { Store } from "../../utils/Store";
// import { useRouter } from "next/router";

//

export default function ProductCard({ medicine }) {
  //   const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const products = medicine;
  if (!products) {
    return <div>Product Not Found</div>;
  }
  const addToCartHandler = async (meds) => {
    const existItem = state.cart.cartItems.find((x) => x.id === meds.id);
    const quantity = existItem ? existItem.quantity + 1 : 1;

    dispatch({ type: "CART_ADD_ITEM", payload: { ...meds, quantity } });
    // router.push("/cart");
  };

  return (
    <div>
      <Grid container spacing={3}>
        {products.map((meds) => (
          <Grid item md={3} key={meds.prodName}>
            <Card>
              <CardActionArea>
                <CardMedia
                  component="img"
                  image={meds.imageUrl}
                  height={350}
                  width={300}
                  title={meds.prodName}
                />
                <CardContent>
                  <Typography>{meds.prodName}</Typography>
                </CardContent>
                <CardContent>
                  <Typography>{meds.genName}</Typography>
                </CardContent>
                <CardContent>
                  <Typography>{meds.strength}</Typography>
                </CardContent>
                <CardContent>
                  <Typography>₱{meds.price}</Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={() => addToCartHandler(meds)}
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
