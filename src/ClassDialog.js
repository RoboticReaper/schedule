import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddIcon from '@material-ui/icons/Add';
import { Checkbox, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useState } from 'react';
import { FormGroup } from '@material-ui/core';
import { FormControlLabel } from '@material-ui/core';
import { FormHelperText } from '@material-ui/core';
import FormControl from "@material-ui/core/FormControl";

var nameError = false;
var checkError = false;

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


export default function ClassDialog({ addClass }) {


    const classes = useStyles();
    const forceUpdate = useForceUpdate();

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        nameError = false;
        checkError = false;
        setOpen(false);
    };


    function submitData() {
        var name = document.getElementById("name").value;
        if (name === '') {
            nameError = true;
            forceUpdate();
            return;
        }

        var room = document.getElementById("room").value;
        var blocks = ["A1", "A2", "A3", "A4", "B1", "B2", "B3", "B4", "C1", "C2", "C3", "C4", "D1", "D2", "D3", "D4", "E1", "E2", "E3", "E4", "F1", "F2", "F3", "F4", "G1", "G2", "G3", "G4", "H1", "H2", "H3", "H4"];
        var chosenBlocks = [];

        blocks.map((code) => {
            if (document.getElementById(code).checked) {
                chosenBlocks.push(code);
            }
        })
        if (chosenBlocks.length === 0) {
            checkError = true;
            forceUpdate();
            return;
        }

        var thisClass = [name, room, chosenBlocks];
        addClass(thisClass);
        nameError = false;
        forceUpdate();
        handleClose();


    }

    return (
        <form className={classes.root} noValidate autoComplete="off">
            <div>
                <IconButton onClick={handleClickOpen}>
                    <AddIcon />
                </IconButton>
                <Dialog disableBackdropClick open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Add a class</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please fill out fields below to add your class.
                        </DialogContentText>
                        <TextField
                            variant="outlined"
                            required
                            helperText="Required"
                            autoFocus
                            id="name"
                            label="Class name"
                            type="text"
                            error={nameError}
                            margin="normal"
                            fullWidth
                        />
                        <TextField
                            variant="outlined"
                            id="room"
                            label="Room #"
                            type="text"
                            fullWidth
                            margin="normal"
                        />

                        <DialogContentText style={{ marginTop: 10 }}>
                            Please select which block you have for this class
                        </DialogContentText>

                        <FormGroup row>
                            <FormControlLabel
                                control={<Checkbox id="A1" />} label="A1" />
                            <FormControlLabel
                                control={<Checkbox id="A2" />} label="A2" />
                            <FormControlLabel
                                control={<Checkbox id="A3" />} label="A3" />
                            <FormControlLabel
                                control={<Checkbox id="A4" />} label="A4" />
                        </FormGroup>
                        <FormGroup row>
                            <FormControlLabel
                                control={<Checkbox id="B1" />} label="B1" />
                            <FormControlLabel
                                control={<Checkbox id="B2" />} label="B2" />
                            <FormControlLabel
                                control={<Checkbox id="B3" />} label="B3" />
                            <FormControlLabel
                                control={<Checkbox id="B4" />} label="B4" />
                        </FormGroup>
                        <FormGroup row>
                            <FormControlLabel
                                control={<Checkbox id="C1" />} label="C1" />
                            <FormControlLabel
                                control={<Checkbox id="C2" />} label="C2" />
                            <FormControlLabel
                                control={<Checkbox id="C3" />} label="C3" />
                            <FormControlLabel
                                control={<Checkbox id="C4" />} label="C4" />
                        </FormGroup>
                        <FormGroup row>
                            <FormControlLabel
                                control={<Checkbox id="D1" />} label="D1" />
                            <FormControlLabel
                                control={<Checkbox id="D2" />} label="D2" />
                            <FormControlLabel
                                control={<Checkbox id="D3" />} label="D3" />
                            <FormControlLabel
                                control={<Checkbox id="D4" />} label="D4" />
                        </FormGroup>
                        <FormGroup row>
                            <FormControlLabel
                                control={<Checkbox id="E1" />} label="E1" />
                            <FormControlLabel
                                control={<Checkbox id="E2" />} label="E2" />
                            <FormControlLabel
                                control={<Checkbox id="E3" />} label="E3" />
                            <FormControlLabel
                                control={<Checkbox id="E4" />} label="E4" />
                        </FormGroup>
                        <FormGroup row>
                            <FormControlLabel
                                control={<Checkbox id="F1" />} label="F1" />
                            <FormControlLabel
                                control={<Checkbox id="F2" />} label="F2" />
                            <FormControlLabel
                                control={<Checkbox id="F3" />} label="F3" />
                            <FormControlLabel
                                control={<Checkbox id="F4" />} label="F4" />
                        </FormGroup>
                        <FormGroup row>
                            <FormControlLabel
                                control={<Checkbox id="G1" />} label="G1" />
                            <FormControlLabel
                                control={<Checkbox id="G2" />} label="G2" />
                            <FormControlLabel
                                control={<Checkbox id="G3" />} label="G3" />
                            <FormControlLabel
                                control={<Checkbox id="G4" />} label="G4" />
                        </FormGroup>
                        <FormGroup row>
                            <FormControlLabel
                                control={<Checkbox id="H1" />} label="H1" />
                            <FormControlLabel
                                control={<Checkbox id="H2" />} label="H2" />
                            <FormControlLabel
                                control={<Checkbox id="H3" />} label="H3" />
                            <FormControlLabel
                                control={<Checkbox id="H4" />} label="H4" />
                        </FormGroup>
                        <FormControl row error={checkError}>
                            <FormHelperText>*Check at least one box</FormHelperText>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={submitData} color="primary">
                            Add
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </form>
    );
}
