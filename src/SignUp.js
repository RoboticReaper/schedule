import { Container, Typography, Button } from "@material-ui/core";
import LockRoundedIcon from '@material-ui/icons/LockRounded';
import { TextField } from "@material-ui/core";
import firestore from "./firestore.js";
import firebase from "firebase/app";
import "firebase/auth";
import { React, useState } from "react";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { useHistory } from "react-router";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


function SignUp() {
    const [alertMsg, setAlertMsg] = useState('');
    const [open, setOpen] = useState(false);
    let history = useHistory();

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

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            if ((window.location.pathname === "/signin" || window.location.pathname === "/signup")) {
                history.replace('/');
            }
        } else {
            localStorage.setItem('uid', "");
            localStorage.setItem('createdClasses', "");
            localStorage.setItem('lunches', "");
            if (window.location.pathname !== '/signin' && window.location.pathname !== '/signup') {
                history.replace('/signin');
            }
        }
    })


    function signUp() {
        const email = document.getElementById('email').value;
        const pswd = document.getElementById('pswd').value;

        if (email === "") {
            setEmailError(true);
            setAlertMsg("Please enter your email address");
            handleClick();
            return;
        } else {
            setEmailError(false);
        }
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
            return firebase.auth().createUserWithEmailAndPassword(email, pswd);
        })
        firebase.auth().createUserWithEmailAndPassword(email, pswd)
            .then((userCredential) => {
                
                var user = userCredential.user;
                var uid = user.uid;
                localStorage.setItem('uid', "");
                localStorage.setItem('createdClasses', "[]");
                localStorage.setItem('lunches', "['', '','','','','']");
                localStorage.setItem('hr', "");
                firestore.db.collection('users').doc(uid).set({ "classes": JSON.stringify([]) }, (error) => {

                });

                window.location.href = '/';
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode);
                console.log(errorMessage);
                if (errorCode === "auth/email-already-in-use") {
                    errorMessage = "Account already exists";
                }
                setAlertMsg(errorMessage);
                handleClick();

            })
    }

    function toSignIn() {
        history.push("/signin")
    }

    return (
        <div className="App">
            <header className='App-header'>
            </header>
            <Container maxWidth="sm">
                <div className="classes.root">
                    <LockRoundedIcon fontSize="large" color="secondary" style={{ marginTop: 30 }} />
                    <Typography gutterBottom variant="h4">Sign Up</Typography>
                    <TextField id="email" variant="outlined" type="email" label="Email" fullWidth margin="normal" error={emailError} autoFocus/>
                    <TextField id="pswd" variant="outlined" type="password" label="Password" fullWidth margin="normal" error={pswdError} />
                    <Button variant="contained" color="secondary" fullWidth margin="normal" onClick={signUp} style={{ marginTop: 20, marginBottom: 20 }}>Sign up</Button>
                    <Button color="secondary" style={{ textTransform: "none" }} onClick={toSignIn}>Already have an account? Sign in</Button>
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
export default SignUp;