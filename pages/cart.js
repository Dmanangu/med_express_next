import React, { useContext } from "react";
import { Store } from "../utils/Store";
import Layout from "../component/Layout";
import dynamic from "next/dynamic";
import {
  Link,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Select,
  MenuItem,
  Button,
  List,
  ListItem,
  Card,
} from "@material-ui/core";
import NextLink from "next/link";
// import axios from "axios";
import { useRouter } from "next/router";
import Image from "next/image";

//

//
function CartScreen() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async (meds) => {
    const existItem = state.cart.cartItems.find((x) => x.id === meds.id);
    const quantity = existItem ? existItem.quantity + 1 : 1;

    dispatch({ type: "CART_ADD_ITEM", payload: { ...meds, quantity } });
    // router.push("/cart");
  };

  const updateCartHandler = async (meds, quantity) => {
    // const { meds } = await axios.get(`/api/products/${item.id}`);
    if (meds.quantity <= 0) {
      window.alert("Sorry. Product is out of Stock");
      return;
    }
    dispatch({ type: "CART_ADD_ITEM", payload: { ...meds, quantity } });
  };
  const removeItemHandler = (meds) => {
    dispatch({ type: "CART_REMOVE_ITEM", payload: meds });
  };
  const checkoutHandler = () => {
    router.push("/shipping");
  };
  return (
    <Layout title="Shopping Cart">
      <Typography component="h1" variant="h1">
        Shopping Cart
      </Typography>
      {cartItems.length === 0 ? (
        <div>
          Cart is empty.{" "}
          <NextLink href="/">
            <Link>Go Shopping</Link>
          </NextLink>
        </div>
      ) : (
        <Grid container spacing={1}>
          <Grid item md={9} xs={12}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell aligh="right"> </TableCell>
                    <TableCell aligh="right">Quantity</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems.map((meds) => (
                    <TableRow key={meds.id}>
                      <TableCell>
                        <Image
                          component="img"
                          src={meds.imageUrl}
                          height={40}
                          width={40}
                          title={meds.prodName}
                          alt="no image"
                        />
                      </TableCell>

                      <TableCell>
                        <Link>
                          <Typography>{meds.prodName}</Typography>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Button
                          // fullWidth
                          variant="contained"
                          color="primary"
                          onClick={() => addToCartHandler(meds)}
                        >
                          add
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={meds.quantity}
                          onChange={(e) =>
                            updateCartHandler(meds, e.target.value)
                          }
                        >
                          {/* need to change so that it can add more than 1 quantity */}
                          {[...Array(meds.quantity).keys()].map((x) => (
                            <MenuItem key={x + 1} value={x + 1}>
                              {x + 1}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell align="right">₱{meds.price}</TableCell>
                      <TableCell align="right">
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => removeItemHandler(meds)}
                        >
                          Remove Item
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid md={3} xs={12}>
            <Card>
              <List>
                <ListItem>
                  <Typography variant="h2">
                    Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{" "}
                    items) : ₱
                    {cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
                  </Typography>
                </ListItem>
                <ListItem>
                  <Button
                    onClick={checkoutHandler}
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    Check Out
                  </Button>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      )}
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });
