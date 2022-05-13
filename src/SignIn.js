import { Container, Typography, Button } from "@material-ui/core";
import LockRoundedIcon from '@material-ui/icons/LockRounded';
import { TextField } from "@material-ui/core";
import firebase from "firebase/app";
import "firebase/auth";
import { React, useState } from "react";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import ResetDialog from './ResetDialog';
import { useHistory } from "react-router";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

var uid;

function SignIn() {
    let history = useHistory();
    const [alertMsg, setAlertMsg] = useState('');
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const [emailError, setEmailError] = useState(false);
    const [pswdError, setPswdError] = useState(false);


    function signIn() {
        const email = document.getElementById('email').value;
        const pswd = document.getElementById('pswd').value;

        if (pswd === '') {
            setAlertMsg("Password can't be empty");
            handleClick();
            setPswdError(true);
            return;
        } else {
            setPswdError(false);
        }
        // pswd and email have no problem
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
            return firebase.auth().signInWithEmailAndPassword(email, pswd);
        })
        firebase.auth().signInWithEmailAndPassword(email, pswd)
            .then((userCredential) => {
                var user = userCredential.user;
                uid = user.uid;
                if (!user.emailVerified) {
                    firebase.auth().currentUser.sendEmailVerification().then(() => {
                        console.log("Email Sent");
                        alert('An email was sent to you to verify your account. Please verify before logging in.');
                        window.location.reload();
                    })
                }
                localStorage.setItem('uid', uid);
                setTimeout(function () { history.push('/') });
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorMessage === "There is no user record corresponding to this identifier. The user may have been deleted.") {
                    errorMessage = "No user with this email exists";
                }
                if (errorMessage === "The password is invalid or the user does not have a password.") {
                    errorMessage = "Wrong password";
                }
                console.log(errorCode);
                console.log(errorMessage);
                setAlertMsg(errorMessage);
                handleClick();
            })
    }

    function toSignUp() {
        history.push('/signup')
    }

    return (
        <div className="App">
            <header className='App-header'>
            </header>
            <Container maxWidth="sm">
                <div className="classes.root">
                    <LockRoundedIcon fontSize="large" color="secondary" style={{ marginTop: 30 }} />
                    <Typography gutterBottom variant="h4">Sign In</Typography>
                    <TextField id="email" variant="outlined" type="email" label="Email" fullWidth margin="normal" error={emailError} autoFocus/>
                    <TextField id="pswd" variant="outlined" type="password" label="Password" fullWidth margin="normal" error={pswdError} />
                    <Button variant="contained" color="secondary" fullWidth margin="normal" onClick={signIn} style={{ marginTop: 20, marginBottom: 20 }}>Sign in</Button>
                    <Button color="secondary" style={{ textTransform: "none" }} onClick={toSignUp}>Don't have an account? Sign up</Button><br></br>
                    <ResetDialog />
                    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity="warning">
                            {alertMsg}
                        </Alert>
                    </Snackbar>
                </div>
            </Container>
        </div>
    )
}
export default SignIn;