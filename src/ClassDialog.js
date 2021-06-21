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
import Classes from './Classes.js'
import { makeStyles } from '@material-ui/core/styles';
import { useState } from 'react';
import { Typography } from '@material-ui/core';

var nameError = false;

const useStyles = makeStyles((theme) => ({
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },
  }));

function useForceUpdate(){
    const [value, setValue] = useState(0);
    return () => setValue(value => value + 1);
}

export default function ClassDialog() {
    const classes = useStyles();
    const forceUpdate = useForceUpdate();

    const [checked, setChecked] = React.useState(true);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
      nameError = false;
    setOpen(false);
  };

  const empty = () => {

  }

    
    handleOnChange = event => {
        console.log('Click');
        console.log(event.target.value);
      };

  function submitData(){

    
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
            margin="normal"
            onChange = {this.handleOnChange}
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
            
            <TextField
            variant="outlined"
                id="teacher"
                label="Teacher"
                type="text"
                fullWidth
                margin="normal"
            />

            <div>
                <div><Checkbox
                    checked={checked}
                    onChange={handleChange}
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
                <Typography gutterBottom align="center">A1</Typography>
                </div>
            </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={() => {submitData() ? handleClose() : empty()}} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
    </form>
  );
}
