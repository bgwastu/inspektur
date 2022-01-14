import React from 'react';
import config from './config';
import {Payload, ResponseData} from './types';
import {CssBaseline, Grid} from '@mui/material';
import Header from './components/Header';
import Result from './components/Result';
import MainForm from './components/MainForm';
import ErrorDialog from './components/ErrorDialog';

export interface State {
    isLoading: boolean;
    isFinished: boolean;
    isError: boolean;
    errorMessage: string;
    response?: ResponseData;
}

function App() {
    const [state, setState] = React.useState<State>({
        isLoading: false,
        isFinished: false,
        isError: false,
        errorMessage: '',
    });

    function onSubmit(payload: Payload) {

        setState({...state, isLoading: true});
        fetch(config.API_URL + '/check', {
            method: 'POST',
            body: JSON.stringify({
                email: payload.email,
                number: '+62' + payload.phone,
            }),
        }).then((res) => {
            // If code is not 200 then throw error
            if (res.status !== 200) {
                setState({
                    isLoading: false,
                    isFinished: false,
                    isError: true,
                    errorMessage: res.body?.toString() ?? 'Gagal mengambil data',
                });
            } else {
                res.json().then((data) => {
                    setState({
                        isFinished: true,
                        response: data,
                        isLoading: false,
                        isError: false,
                        errorMessage: '',
                    });
                });
            }
        });
    }

    return (
        <>
            <CssBaseline/>
            <Grid container
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                  sx={{
                      height: '100vh',
                      padding: '10px'
                  }}

            >
                <Grid
                    item
                    xs={6}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'stretch',
                    }}
                    gap={1}
                >
                    <Header/>
                    {state.isFinished ? <Result/> : <MainForm onSubmit={onSubmit} state={state}/>}
                </Grid>
            </Grid>
            <ErrorDialog setState={setState} state={state}/>
        </>
    );
}

export default App;
