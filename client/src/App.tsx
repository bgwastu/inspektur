import React from 'react';
import {
    Box,
    Button,
    Checkbox,
    CssBaseline,
    FormControlLabel,
    FormGroup,
    Grid,
    InputAdornment,
    TextField
} from '@mui/material';
import {Search} from '@mui/icons-material';
import Header from './components/Header';

function App() {
    const [emailVisibility, setEmailVisibility] = React.useState(true);
    const [phoneVisibility, setPhoneVisibility] = React.useState(true);
    const [isLoading, setIsLoading] = React.useState(false);

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
                    <FormGroup sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                    }}>
                        <FormControlLabel control={
                            <Checkbox
                                defaultChecked
                                checked={emailVisibility}
                                onChange={() => setEmailVisibility(!emailVisibility)}
                            />
                        } label="Email"/>
                        <FormControlLabel control={
                            <Checkbox
                                defaultChecked
                                checked={phoneVisibility}
                                onChange={() => setPhoneVisibility(!phoneVisibility)}
                            />
                        } label="Nomor Telepon"/>
                    </FormGroup>
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="stretch"
                        gap={1.5}
                    >
                        <TextField id="outlined-basic" label="Email" variant="outlined" disabled={!emailVisibility}/>
                        <TextField id="outlined-basic" label="Nomor Telepon" variant="outlined"
                                   disabled={!phoneVisibility} InputProps={{
                            startAdornment: <InputAdornment position="start">+62</InputAdornment>,
                        }}/>
                        <Button variant="contained" endIcon={<Search/>}>Selidik</Button>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
}

export default App;
