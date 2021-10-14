import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Avatar, Paper, Button, Typography, Grid, Container } from "@material-ui/core";
import { GoogleLogin } from "react-google-login"

import { signin, signup } from "../../actions/auth"

import Icon from "./icon"
import LockOutlinedIcon from "@material-ui/icons/LockOutlined"
import Input from "./Input";

import useStyles from "./styles"

const initialFormData = { firstName: "", lastName: "", email: "", password: "", confirmPassword: "" }

const Auth = () => {
	const classes = useStyles()
	const [showPassword, setShowPassword] = useState(false)
	const [isSignup, setIsSignUp] = useState(false)
	const [formData, setFormData] = useState(initialFormData)

	const dispatch = useDispatch()
	const history = useHistory()

	const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword)

	const handleSubmit = (e) => {
		e.preventDefault();
		if (isSignup) {
			dispatch(signup(formData, history))
		}
		else {
			dispatch(signin(formData, history))
		}
	}

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value })
	}

	const switchMode = () => {
		setIsSignUp(prevIsSignUp => !prevIsSignUp)
		setShowPassword(false)
	}

	const googleSuccess = async (res) => {
		const result = res?.profileObj
		const token = res?.tokenId

		try {
			dispatch({ type: "AUTH", data: { result, token } })

			history.push("/")
		}
		catch (error) {
			console.log(error)
		}
	}

	const googleFailure = (error) => {
		console.log(error)
		console.log("Google Sign In was unsuccessful. Please try again.")
	}

	return (
		<Container component="main" maxWidth="xs">
			<Paper className={classes.paper} elevation={3}>
				<Avatar className={classes.avatar}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography variant="h5">{isSignup ? "Sign Up" : "Sign In"}</Typography>
				<form className={classes.form} onSubmit={handleSubmit}>
					<Grid container spacing={2}>
						{
							isSignup && (
								<>
									<Input type="text" name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
									<Input type="text" name="lastName" label="Last Name" handleChange={handleChange} half />
								</>
							)
						}
						<Input name="email" label="Email Address" handleChange={handleChange} type="email" autoFocus />
						<Input name="password" label="Password" type={showPassword ? "text" : "password"}
							handleShowPassword={handleShowPassword} handleChange={handleChange} />
						{isSignup && <Input name="confirmPassword" label="Confirm Password" handleChange={handleChange} type="password" />}
					</Grid>
					<Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
						{isSignup ? "Sign Up" : "Sign In"}
					</Button>
					<GoogleLogin
						// clientId="570305995489-ojg6mkpv5oikghhpnr8pcj5l3kl5r94a.apps.googleusercontent.com" this one is for local environment
						clientId="175533025150-st66ql8sfgu9d13irgefn0saiqqobs98.apps.googleusercontent.com"
						render={(renderProps) => (
							<Button className={classes.googleButton} color="primary" fullWidth onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<Icon />} variant="contained">
								Google Sign In
							</Button>
						)}
						onSuccess={googleSuccess}
						onFailure={googleFailure}
						cookiePolicy="single_host_origin"
					/>
					<Grid container justifyContent="flex-end">
						<Grid type="item">
							<Button onClick={switchMode}>
								{isSignup ? "Already have an accout? Sign In" : "DOn't have an account? Sign Up"}
							</Button>
						</Grid>
					</Grid>
				</form>
			</Paper>
		</Container>
	)
}

export default Auth