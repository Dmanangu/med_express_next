import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import React, { useEffect, useContext, useState } from 'react';
import { Grid, List, ListItem, Typography, Card, Button, ListItemText, TextField } from '@material-ui/core';
import { getError } from '../utils/error';
import { Store } from '../utils/Store';
import Layout from '../component/Layout';
import useStyles from '../utils/style';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import Cookies from 'js-cookie';
import { UserContext } from '../lib/context';
import { auth, postToJSON, firestore } from '../lib/firebase';

export async function getServerSideProps() {
	const postsQuery = firestore.collectionGroup('users');

	// .where('published', '==', true)
	// .orderBy('createdAt', 'desc')
	// .limit(LIMIT);

	const posts = (await postsQuery.get()).docs.map(postToJSON);

	return {
		props: { posts } // will be passed to the page component as props
	};
}
function Profile(props) {
	const { dispatch } = useContext(Store);
	const { handleSubmit, control, formState: { errors }, setValue } = useForm();
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const router = useRouter();
	const classes = useStyles();
	const { user } = useContext(UserContext);

	const [ posts ] = useState(props.posts);

	const profileName = posts.filter((doc) => {
		return doc.id.includes(auth.currentUser.uid);
	});

	useEffect(() => {
		if (!user) {
			return router.push('/login');
		}
		setValue('name', profileName[0].name);
		setValue('email', user.email);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const submitHandler = async ({ name, email, password, confirmPassword }) => {
		closeSnackbar();
		if (password !== confirmPassword) {
			enqueueSnackbar("Passwords don't match", { variant: 'error' });
			return;
		}
		try {
			const { user } = await axios.put(
				'/api/users/profile',
				{
					name,
					email,
					password
				},
				{ headers: { authorization: `Bearer ${user.token}` } }
			);
			dispatch({ type: 'USER_LOGIN', payload: user });
			Cookies.set(user);

			enqueueSnackbar('Profile updated successfully', { variant: 'success' });
		} catch (err) {
			enqueueSnackbar(getError(err), { variant: 'error' });
		}
	};
	return (
		<Layout title="Profile">
			<Grid container spacing={1}>
				<Grid item md={3} xs={12}>
					<Card className={classes.section}>
						<List>
							<NextLink href="/profile" passHref>
								<ListItem selected button component="a">
									<ListItemText primary="User Profile" />
								</ListItem>
							</NextLink>
							<NextLink href="/order-history" passHref>
								<ListItem button component="a">
									<ListItemText primary="Order History" />
								</ListItem>
							</NextLink>
						</List>
					</Card>
				</Grid>
				<Grid item md={9} xs={12}>
					<Card className={classes.section}>
						<List>
							<ListItem>
								<Typography component="h1" variant="h1">
									Profile
								</Typography>
							</ListItem>
							<ListItem>
								<form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
									<List>
										<ListItem>
											<Controller
												name="name"
												control={control}
												defaultValue=""
												rules={{
													required: true,
													minLength: 2
												}}
												render={({ field }) => (
													<TextField
														variant="outlined"
														fullWidth
														disabled={true}
														id="name"
														label="Name"
														inputProps={{ type: 'name' }}
														error={Boolean(errors.name)}
														helperText={
															errors.name ? errors.name.type === 'minLength' ? (
																'Name length is more than 1'
															) : (
																'Name is required'
															) : (
																''
															)
														}
														{...field}
													/>
												)}
											/>
										</ListItem>
										<ListItem>
											<Controller
												name="email"
												control={control}
												defaultValue=""
												rules={{
													required: true,
													pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/
												}}
												render={({ field }) => (
													<TextField
														variant="outlined"
														fullWidth
														disabled={true}
														id="email"
														label="Email"
														inputProps={{ type: 'email' }}
														error={Boolean(errors.email)}
														helperText={
															errors.email ? errors.email.type === 'pattern' ? (
																'Email is not valid'
															) : (
																'Email is required'
															) : (
																''
															)
														}
														{...field}
													/>
												)}
											/>
										</ListItem>
									</List>
								</form>
							</ListItem>
						</List>
					</Card>
				</Grid>
			</Grid>
		</Layout>
	);
}

export default dynamic(() => Promise.resolve(Profile), { ssr: false });
