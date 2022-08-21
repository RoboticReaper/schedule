import { Container, Typography, Button } from "@material-ui/core";
import LockRoundedIcon from '@material-ui/icons/LockRounded';
import { TextField } from "@material-ui/core";
import firebase from "firebase/app";
import "firebase/auth";
import { React, useState } from "react";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import ResetDialog from './ResetDialog';
import { useHistory } from "react-router-dom";

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
                
                localStorage.setItem('uid', uid);
                localStorage.setItem('createdClasses', "[]");
                localStorage.setItem('lunches', "['', '','','','','']");
                localStorage.setItem('hr', "");
                window.location.href = "/";
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

    const openInNewTab = (url) => {
        if(navigator.userAgent.match(/(iPhone|iPad)/)){
            window.location.href = url;
        } else {
            window.open(url, '_blank', 'noopener,noreferrer')
        };
    }

    function toSignUp() {
        history.push('/signup')
    }

    return (
        <div className="App">
            <header className='App-header'>
            </header>
            <Container maxWidth="sm" style={{marginBottom: 100}}>
                <div className="classes.root">
                    <Typography gutterBottom variant="h5" style={{marginTop: 30}}>Welcome to the LHS schedule app!</Typography>
                    <Typography gutterBottom variant="h6">This is a schedule management app for Lexington High School students. The schedule will <i>always</i> be up to date!</Typography>
                    <LockRoundedIcon fontSize="large" color="secondary" style={{ marginTop: 30 }} />
                    <Typography gutterBottom variant="h4">Sign In</Typography>
                    <TextField id="email" variant="outlined" type="email" label="Email" fullWidth margin="normal" error={emailError} autoFocus/>
                    <TextField id="pswd" variant="outlined" type="password" label="Password" fullWidth margin="normal" error={pswdError} />
                    <Button variant="contained" color="secondary" fullWidth margin="normal" onClick={signIn} style={{ marginTop: 20, marginBottom: 20 }}>Sign in</Button>
                    <Button color="secondary" style={{ textTransform: "none" }} onClick={toSignUp}>Don't have an account? Sign up</Button><br></br>
                    <ResetDialog />
                    <Button color="secondary" style={{ textTransform: "none" }} onClick={() => {openInNewTab("mailto:liubaoren2006@gmail.com")}}>Contact me by Email</Button><br></br>
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