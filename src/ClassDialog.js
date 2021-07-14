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
import EditIcon from '@material-ui/icons/Edit';

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

export default function ClassDialog({ addClass, currClass, currIndex, saveClass }) {
    var initName = "";
    var initRoom = "";
    var aa1 = false;
    var aa2 = false;
    var aa3 = false;
    var aa4 = false;
    var ab1 = false;
    var ab2 = false;
    var ab3 = false;
    var ab4 = false;
    var ac1 = false;
    var ac2 = false;
    var ac3 = false;
    var ac4 = false;
    var ad1 = false;
    var ad2 = false;
    var ad3 = false;
    var ad4 = false;
    var ae1 = false;
    var ae2 = false;
    var ae3 = false;
    var ae4 = false;
    var af1 = false;
    var af2 = false;
    var af3 = false;
    var af4 = false;
    var ag1 = false;
    var ag2 = false;
    var ag3 = false;
    var ag4 = false;
    var ah1 = false;
    var ah2 = false;
    var ah3 = false;
    var ah4 = false;
    const blocks = ["A1", "A2", "A3", "A4", "B1", "B2", "B3", "B4", "C1", "C2", "C3", "C4", "D1", "D2", "D3", "D4", "E1", "E2", "E3", "E4", "F1", "F2", "F3", "F4", "G1", "G2", "G3", "G4", "H1", "H2", "H3", "H4"];


    if (currClass !== undefined) {
        // fill out the field based on currClass's data
        initName = currClass[0];
        initRoom = currClass[1];
        currClass[2].map((i) => {
            switch (i) {
                case blocks[0]:
                    aa1 = true;
                    break;

                case blocks[1]:
                    aa2 = true;
                    break;

                case blocks[2]:
                    aa3 = true;
                    break;

                case blocks[3]:
                    aa4 = true;
                    break;

                case blocks[4]:
                    ab1 = true;
                    break;

                case blocks[5]:
                    ab2 = true;
                    break;

                case blocks[6]:
                    ab3 = true;
                    break;

                case blocks[7]:
                    ab4 = true;
                    break;
                case blocks[8]:
                    ac1 = true;
                    break;

                case blocks[9]:
                    ac2 = true;
                    break;

                case blocks[10]:
                    ac3 = true;
                    break;

                case blocks[11]:
                    ac4 = true;
                    break;
                case blocks[12]:
                    ad1 = true;
                    break;

                case blocks[13]:
                    ad2 = true;
                    break;

                case blocks[14]:
                    ad3 = true;
                    break;

                case blocks[15]:
                    ad4 = true;
                    break;
                case blocks[16]:
                    ae1 = true;
                    break;

                case blocks[17]:
                    ae2 = true;
                    break;

                case blocks[18]:
                    ae3 = true;
                    break;

                case blocks[19]:
                    ae4 = true;
                    break;
                case blocks[20]:
                    af1 = true;
                    break;

                case blocks[21]:
                    af2 = true;
                    break;

                case blocks[22]:
                    af3 = true;
                    break;

                case blocks[23]:
                    af4 = true;
                    break;
                case blocks[24]:
                    ag1 = true;
                    break;

                case blocks[25]:
                    ag2 = true;
                    break;

                case blocks[26]:
                    ag3 = true;
                    break;

                case blocks[27]:
                    ag4 = true;
                    break;
                case blocks[28]:
                    ah1 = true;
                    break;

                case blocks[29]:
                    ah2 = true;
                    break;

                case blocks[30]:
                    ah3 = true;
                    break;

                case blocks[31]:
                    ah4 = true;
                    break;
            }
        })
    }


    var chosenBlocks = [];

    const classes = useStyles();
    const forceUpdate = useForceUpdate();

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };


    const [name, setName] = useState(initName);
    const [room, setRoom] = useState(initRoom);
    const [a1, setA1] = useState(aa1);
    const [a2, setA2] = useState(aa2);
    const [a3, setA3] = useState(aa3);
    const [a4, setA4] = useState(aa4);
    const [b1, setB1] = useState(ab1);
    const [b2, setB2] = useState(ab2);
    const [b3, setB3] = useState(ab3);
    const [b4, setB4] = useState(ab4);
    const [c1, setC1] = useState(ac1);
    const [c2, setC2] = useState(ac2);
    const [c3, setC3] = useState(ac3);
    const [c4, setC4] = useState(ac4);
    const [d1, setD1] = useState(ad1);
    const [d2, setD2] = useState(ad2);
    const [d3, setD3] = useState(ad3);
    const [d4, setD4] = useState(ad4);
    const [e1, setE1] = useState(ae1);
    const [e2, setE2] = useState(ae2);
    const [e3, setE3] = useState(ae3);
    const [e4, setE4] = useState(ae4);
    const [f1, setF1] = useState(af1);
    const [f2, setF2] = useState(af2);
    const [f3, setF3] = useState(af3);
    const [f4, setF4] = useState(af4);
    const [g1, setG1] = useState(ag1);
    const [g2, setG2] = useState(ag2);
    const [g3, setG3] = useState(ag3);
    const [g4, setG4] = useState(ag4);
    const [h1, setH1] = useState(ah1);
    const [h2, setH2] = useState(ah2);
    const [h3, setH3] = useState(ah3);
    const [h4, setH4] = useState(ah4);

    const handleClose = () => {
        nameError = false;
        checkError = false;
        setOpen(false);
        setName(initName);
        setRoom(initRoom);
        setA1(aa1);
        setA2(aa2);
        setA3(aa3);
        setA4(aa4);
        setB1(ab1);
        setB2(ab2);
        setB3(ab3);
        setB4(ab4);
        setC1(ac1);
        setC2(ac2);
        setC3(ac3);
        setC4(ac4);
        setD1(ad1);
        setD2(ad2);
        setD3(ad3);
        setD4(ad4);
        setE1(ae1);
        setE2(ae2);
        setE3(ae3);
        setE4(ae4);
        setF1(af1);
        setF2(af2);
        setF3(af3);
        setF4(af4);
        setG1(ag1);
        setG2(ag2);
        setG3(ag3);
        setG4(ag4);
        setH1(ah1);
        setH2(ah2);
        setH3(ah3);
        setH4(ah4);
    };



    function submitData() {
        var name = document.getElementById("name").value;
        if (name === '') {
            nameError = true;
            forceUpdate();
            return;
        }

        var room = document.getElementById("room").value;

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
        addClass(thisClass, currIndex);
        nameError = false;
        forceUpdate();
        handleClose();


    }


    function saveData() {
        if (name === '') {
            nameError = true;
            forceUpdate();
            return;
        }



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
        saveClass(thisClass, currIndex);
        nameError = false;
        forceUpdate();
        handleClose();
    }

    return (
        <form className={classes.root} noValidate autoComplete="off">
            <div>
                <IconButton onClick={handleClickOpen}>
                    {currClass === undefined ? <AddIcon /> : <EditIcon />}
                </IconButton>
                <Dialog disableBackdropClick open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Add/edit a class</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please fill out fields below to add/edit your class.
                        </DialogContentText>
                        <TextField
                            variant="outlined"
                            required
                            helperText="Required"
                            autoFocus
                            id="name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            label="Class name"
                            type="text"
                            error={nameError}
                            margin="normal"
                            fullWidth
                        />
                        <TextField
                            variant="outlined"
                            id="room"
                            value={room}
                            onChange={e => setRoom(e.target.value)}
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
                                control={<Checkbox id="A1" checked={a1} onChange={() => { setA1(!a1) }} />} label="A1" />
                            <FormControlLabel
                                control={<Checkbox id="A2" checked={a2} onChange={() => { setA2(!a2) }} />} label="A2" />
                            <FormControlLabel
                                control={<Checkbox id="A3" checked={a3} onChange={() => { setA3(!a3) }} />} label="A3" />
                            <FormControlLabel
                                control={<Checkbox id="A4" checked={a4} onChange={() => { setA4(!a4) }} />} label="A4" />
                        </FormGroup>
                        <FormGroup row>
                            <FormControlLabel
                                control={<Checkbox id="B1" checked={b1} onChange={() => { setB1(!b1) }} />} label="B1" />
                            <FormControlLabel
                                control={<Checkbox id="B2" checked={b2} onChange={() => { setB2(!b2) }} />} label="B2" />
                            <FormControlLabel
                                control={<Checkbox id="B3" checked={b3} onChange={() => { setB3(!b3) }} />} label="B3" />
                            <FormControlLabel
                                control={<Checkbox id="B4" checked={b4} onChange={() => { setB4(!b4) }} />} label="B4" />
                        </FormGroup>
                        <FormGroup row>
                            <FormControlLabel
                                control={<Checkbox id="C1" checked={c1} onChange={() => { setC1(!c1) }} />} label="C1" />
                            <FormControlLabel
                                control={<Checkbox id="C2" checked={c2} onChange={() => { setC2(!c2) }} />} label="C2" />
                            <FormControlLabel
                                control={<Checkbox id="C3" checked={c3} onChange={() => { setC3(!c3) }} />} label="C3" />
                            <FormControlLabel
                                control={<Checkbox id="C4" checked={c4} onChange={() => { setC4(!c4) }} />} label="C4" />
                        </FormGroup>
                        <FormGroup row>
                            <FormControlLabel
                                control={<Checkbox id="D1" checked={d1} onChange={() => { setD1(!d1) }} />} label="D1" />
                            <FormControlLabel
                                control={<Checkbox id="D2" checked={d2} onChange={() => { setD2(!d2) }} />} label="D2" />
                            <FormControlLabel
                                control={<Checkbox id="D3" checked={d3} onChange={() => { setD3(!d3) }} />} label="D3" />
                            <FormControlLabel
                                control={<Checkbox id="D4" checked={d4} onChange={() => { setD4(!d4) }} />} label="D4" />
                        </FormGroup>
                        <FormGroup row>
                            <FormControlLabel
                                control={<Checkbox id="E1" checked={e1} onChange={() => { setE1(!e1) }} />} label="E1" />
                            <FormControlLabel
                                control={<Checkbox id="E2" checked={e2} onChange={() => { setE2(!e2) }} />} label="E2" />
                            <FormControlLabel
                                control={<Checkbox id="E3" checked={e3} onChange={() => { setE3(!e3) }} />} label="E3" />
                            <FormControlLabel
                                control={<Checkbox id="E4" checked={e4} onChange={() => { setE4(!e4) }} />} label="E4" />
                        </FormGroup>
                        <FormGroup row>
                            <FormControlLabel
                                control={<Checkbox id="F1" checked={f1} onChange={() => { setF1(!f1) }} />} label="F1" />
                            <FormControlLabel
                                control={<Checkbox id="F2" checked={f2} onChange={() => { setF2(!f2) }} />} label="F2" />
                            <FormControlLabel
                                control={<Checkbox id="F3" checked={f3} onChange={() => { setF3(!f3) }} />} label="F3" />
                            <FormControlLabel
                                control={<Checkbox id="F4" checked={f4} onChange={() => { setF4(!f4) }} />} label="F4" />
                        </FormGroup>
                        <FormGroup row>
                            <FormControlLabel
                                control={<Checkbox id="G1" checked={g1} onChange={() => { setG1(!g1) }} />} label="G1" />
                            <FormControlLabel
                                control={<Checkbox id="G2" checked={g2} onChange={() => { setG2(!g2) }} />} label="G2" />
                            <FormControlLabel
                                control={<Checkbox id="G3" checked={g3} onChange={() => { setG3(!g3) }} />} label="G3" />
                            <FormControlLabel
                                control={<Checkbox id="G4" checked={g4} onChange={() => { setG4(!g4) }} />} label="G4" />
                        </FormGroup>
                        <FormGroup row>
                            <FormControlLabel
                                control={<Checkbox id="H1" checked={h1} onChange={() => { setH1(!h1) }} />} label="H1" />
                            <FormControlLabel
                                control={<Checkbox id="H2" checked={h2} onChange={() => { setH2(!h2) }} />} label="H2" />
                            <FormControlLabel
                                control={<Checkbox id="H3" checked={h3} onChange={() => { setH3(!h3) }} />} label="H3" />
                            <FormControlLabel
                                control={<Checkbox id="H4" checked={h4} onChange={() => { setH4(!h4) }} />} label="H4" />
                        </FormGroup>
                        <FormControl row error={checkError}>
                            <FormHelperText>*Check at least one box</FormHelperText>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        {currClass === undefined ? <Button onClick={submitData} color="primary">
                            Add
                        </Button> :
                            <Button onClick={saveData} color="primary">Save</Button>}
                    </DialogActions>
                </Dialog>
            </div>
        </form>
    );
}
