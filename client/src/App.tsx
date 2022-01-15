import React from 'react';
import config from './config';
import {Payload, ResponseData} from './types';
import {Box, CssBaseline, Grid} from '@mui/material';
import Header from './components/Header';
import Result from './components/Result';
import MainForm from './components/MainForm';
import ErrorDialog from './components/ErrorDialog';
import Footer from './components/Footer';

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

    function onSubmit(payload: Payload, emailVisibility: boolean, phoneVisibility: boolean) {
        if (payload.email === '' || !emailVisibility) {
            payload.email = null;
        }

        let phone: string | null = '+62' + payload.phone;
        if (payload.phone === '' || !phoneVisibility) {
            phone = null;
        }

        setState({...state, isLoading: true});
        fetch(config.API_URL + '/check', {
            method: 'POST',
            body: JSON.stringify({
                email: payload.email,
                number: phone,
            }),
        }).then((res) => {
            // If code is not 200 then throw error
            if (res.status !== 200) {
                setState({
                    isLoading: false,
                    isFinished: false,
                    isError: true,
                    errorMessage: 'Gagal mengambil data',
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


    function goBack() {
        setState({
            isLoading: false,
            isFinished: false,
            isError: false,
            errorMessage: '',
        });
    }

    return (
        <>
            <CssBaseline/>
            <Grid container
                  direction="row"
                  justifyContent="center"
                  alignItems="stretch"
                  sx={{
                      height: '100vh',
                      width: '100wh',
                      maxWidth: '100%',
                      maxHeight: '100%',
                      padding: '10px'
                  }}

            >
                <Grid
                    item
                    xs={12}
                    sm={8}
                    md={5}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'stretch',
                    }}
                    gap={1}
                >
                    <Box sx={{
                        flexGrow: 1,
                    }}/>
                    <Header/>
                    <Box
                        sx={{
                            flexGrow: 1
                        }}>
                        {state.isFinished && state.response ? <Result goBack={goBack} data={state.response}/> :
                            <MainForm onSubmit={onSubmit} state={state}/>}
                    </Box>
                    <Footer/>
                </Grid>
            </Grid>
            <ErrorDialog setState={setState} state={state}/>
        </>
    );
}

export default App;
