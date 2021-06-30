import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import { useState } from 'react';
import firebase from "firebase/app";
import "firebase/auth";

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));


function useForceUpdate() {
    const [value, setValue] = useState(0);
    return () => setValue(value => value + 1);
}

export default function ResetDialog() {
    const classes = useStyles();
    const forceUpdate = useForceUpdate();

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };


    const handleClose = () => {
        setOpen(false);
    };

    function submitData() {
        var email = document.getElementById("resetEmail").value;

        //reset password
        firebase.auth().sendPasswordResetEmail(email).then(() => {
            alert("Check your email for password reset.");
            handleClose();
            window.location.href = "/signin";
        }).catch((error) => {
            var errorCode = error.code;
            if (errorCode === "auth/user-not-found") {
                alert("Account with that email doesn't exist. Please register an account");
            }
        })
    }
    return (
        <>
            <form className={classes.root} noValidate autoComplete="off">
                <div>
                    <Button color="secondary" style={{ textTransform: "none" }} onClick={handleClickOpen}>Forgot/reset password</Button>
                    <Dialog disableBackdropClick open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">Forgot/reset password</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Please fill out fields below to reset your password.
                            </DialogContentText>
                            <TextField
                                defaultValue="@lexingtonma.org"
                                variant="outlined"
                                required
                                helperText="Required"
                                autoFocus
                                id="resetEmail"
                                label="Your school email"
                                type="text"
                                margin="normal"
                                fullWidth
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={submitData} color="primary">
                                Send
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </form>
        </>
    );
}