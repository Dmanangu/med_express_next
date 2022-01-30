import {
	Button,
	FormControl,
	FormControlLabel,
	List,
	ListItem,
	Radio,
	RadioGroup,
	Typography
} from '@material-ui/core';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React, { useContext, useEffect, useState } from 'react';
import CheckoutWizzard from '../component/CheckoutWizzard';
import Layout from '../component/Layout';
import { Store } from '../utils/Store';
import useStyles from '../utils/style';

export default function Payment() {
	const { enqueueSnackbar } = useSnackbar();
	const classes = useStyles();
	const router = useRouter();
	const [ paymentMethod, setPaymentMethod ] = useState('');
	const { state, dispatch } = useContext(Store);
	const { cart: { shippingAddress } } = state;
	useEffect(() => {
		if (!shippingAddress) {
			alert('No shipping address was saved');
			router.push('/shipping');
		} else {
			setPaymentMethod(Cookies.get('paymentMethod') || '');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const submitHandler = (e) => {
		e.preventDefault();
		if (!paymentMethod) {
			enqueueSnackbar('Payment Method is required', { variant: 'error' });
		} else {
			dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethod });
			Cookies.set('paymentMethod', paymentMethod);
			router.push('/placeorder');
		}
	};
	return (
		<Layout title="Payment Method">
			<CheckoutWizzard activeStep={2} />
			<form className={classes.form} onSubmit={submitHandler}>
				<Typography component="h1" variant="h1">
					Payment Method
				</Typography>
				<List>
					<ListItem>
						<FormControl component="fieldset">
							<RadioGroup
								aria-label="Payment Method"
								name="paymentMethod"
								value={paymentMethod}
								onChange={(e) => setPaymentMethod(e.target.value)}
							>
								<FormControlLabel label="Cash on Delivery" value="Cash" control={<Radio />} />
								<FormControlLabel label="GCash" value="GCash" control={<Radio />} />
								<FormControlLabel label="Paymaya" value="Paymaya" control={<Radio />} />
							</RadioGroup>
						</FormControl>
					</ListItem>
					<ListItem>
						<Button fullWidth type="submit" variant="contained" color="primary">
							Continue
						</Button>
					</ListItem>
					<ListItem>
						<Button fullWidth type="button" variant="contained" onClick={() => router.push('/shipping')}>
							Back
						</Button>
					</ListItem>
				</List>
			</form>
		</Layout>
	);
}
