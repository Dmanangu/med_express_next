import { List, ListItem, Typography, TextField, Button, Link } from '@material-ui/core';
import axios from 'axios';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import React, { useContext, useEffect } from 'react';
import Layout from '../component/Layout';
import { Store } from '../utils/Store';
import useStyles from '../utils/style';
import Cookies from 'js-cookie';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { auth, googleAuthProvider, firestore } from '../lib/firebase';

import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
// import Image from 'next/image';

export default function Login() {
	const { handleSubmit, control, formState: { errors } } = useForm();
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const router = useRouter();
	const { redirect } = router.query; // login?redirect=/shipping
	const { state, dispatch } = useContext(Store);
	// const { userInfo } = state;
	// useEffect(() => {
	// 	if (userInfo) {
	// 		router.push('/');
	// 	}
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, []);

	const auth = getAuth();

	const classes = useStyles();
	const submitHandler = async ({ email, password }) => {
		//palitan ng firebase
		closeSnackbar();
		try {
			signInWithEmailAndPassword(auth, email, password)
				.then((authUser) => {
					console.log('Successfully Signed In');
					//router.push('/logged_in');
				})
				.catch((error) => {
					console.log(error.message);
				});

			//palitan ng firebase
			// dispatch({ type: 'USER_LOGIN', payload: data });
			// Cookies.set('userInfo', data);
			router.push(redirect || '/');
		} catch (err) {
			enqueueSnackbar('Invalid email or Password', err.response.data ? err.response.data.message : err.message, {
				variant: 'error'
			});
		}
	};

	// const submitHandler = () => {
	// 	closeSnackbar();
	// 	if (password !== confirmPassword) {
	// 		enqueueSnackbar("Password don't match", { variant: 'error' });
	// 		return;
	// 	}

	// 	console.log('KKKKKKKKKKKKKKKKKKKK');
	// 	console.log(email);
	// 	console.log(password);

	// 	console.log('KKKKKKKKKKKKKKKKKKKK');
	// 	try {
	// 		createUserWithEmailAndPassword(auth, email, password)
	// 			.then((authUser) => {
	// 				console.log('Success. The user is created in firebase');
	// 				//router.push('/logged_in');
	// 			})
	// 			.catch((error) => {
	// 				console.log(error.message);
	// 			});

	// 		// .then((userCredential) => {
	// 		// 	console.log(userCredential);
	// 		// 	//Signed in
	// 		// 	// const users = userCredential.user;
	// 		// 	// // ...
	// 		// 	// dispatch({ type: 'USER_LOGIN', payload: users });
	// 		// 	// Cookies.set(users);
	// 		// });

	// 		// console.log(auth.currentUser.uid);

	// 		// const userDoc = firestore.doc(`users/${auth.currentUser.uid}`);
	// 		// //const usernameDoc = firestore.doc(usernames/${formValue});

	// 		// // Commit both docs together as a batch write.
	// 		// const batch = firestore.batch();
	// 		// batch.set(userDoc, {
	// 		// 	name: name,
	// 		// 	id: auth.currentUser.uid,
	// 		// 	email: email,
	// 		// 	password: password
	// 		// });
	// 		//needs db
	// 		router.push(redirect || '/');
	// 		alert('success login');
	// 	} catch (err) {
	// 		enqueueSnackbar('Account Creation Error');
	// 	}
	// };

	return (
		<Layout title="Login">
			<form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
				<Typography component="h1" variant="h1">
					Login
				</Typography>
				<List>
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
					<ListItem>
						<Controller
							name="password"
							control={control}
							defaultValue=""
							rules={{
								required: true,
								minLength: 6
							}}
							render={({ field }) => (
								<TextField
									variant="outlined"
									fullWidth
									id="password"
									label="Password"
									inputProps={{ type: 'password' }}
									error={Boolean(errors.password)}
									helperText={
										errors.password ? errors.password.type === 'minLength' ? (
											'Password length is more than 5'
										) : (
											'Password is required'
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
						<Button variant="contained" type="submit" fullWidth color="primary">
							Login
						</Button>
					</ListItem>
					<ListItem>
						Don&apos;t have an account? &nbsp;
						<NextLink href={`/register?redirect=${redirect || '/'}`} passHref>
							<Link>Register</Link>
						</NextLink>
					</ListItem>
					<SignInButton />
				</List>
			</form>
		</Layout>
	);
}

//sign In with google
function SignInButton() {
	const router = useRouter();
	const signInWithGoogle = async () => {
		await auth.signInWithPopup(googleAuthProvider);
		// Create refs for both documents
		const userDoc = firestore.doc(`users/${auth.currentUser.uid}`);
		//const usernameDoc = firestore.doc(usernames/${formValue});

		// Commit both docs together as a batch write.
		const batch = firestore.batch();
		batch.set(userDoc, {
			name: auth.currentUser.displayName,
			id: auth.currentUser.uid,
			email: auth.currentUser.email
		});
		//batch.set(usernameDoc, { uid: user.uid });
		if (!userDoc) {
			throw new Error('There was an error in Login');
		}
		if (userDoc) {
			router.push('/');
		}
		await batch.commit();
	};
	return (
		<Button onClick={signInWithGoogle} variant="contained">
			Sign in with Google
		</Button>
	);
}

// <Image src={googleIcon} height={50} width={50} alt="google icon" />
