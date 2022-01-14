import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';
import React from 'react';
import {State} from '../App';

interface Props {
    state: State;

    setState(state: State): void;
}

function ErrorDialog(props: Props) {
    return <Dialog
        open={props.state.isError}
        onClose={() => props.setState({...props.state, isError: false, errorMessage: ''})}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">
            {'Terjadi kesalahan'}
        </DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
                {props.state.errorMessage}
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => props.setState({...props.state, isError: false, errorMessage: ''})}>Tutup</Button>
        </DialogActions>
    </Dialog>;
}

export default ErrorDialog;