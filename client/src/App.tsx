import React, {useEffect} from 'react';
import {
    Box,
    Button,
    Checkbox,
    CssBaseline, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    FormControlLabel,
    FormGroup,
    Grid,
    InputAdornment,
    TextField,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import {Search} from '@mui/icons-material';
import Header from './components/Header';
import {useFormik} from 'formik';
import config from './config';

interface Values {
    email: string;
    phone: string;
}

interface Telegram {
    id: number;
    status: string;
    username: string;
    last_online: Date;
}

interface SocialMediaInfo {
    name: string;
    domain: string;
    method: string;
    frequent_rate_limit: string;
    rate_limit: boolean;
    exists: boolean;
}

interface PhoneNumberInfo {
    operator: string;
    telegram: Telegram;
    data: SocialMediaInfo[];
}

interface Error {
    isError: boolean;
    message: string[];
}

interface Breach {
    title: string;
    date: string;
    breached_data: string;
    total_breach: string;
}

interface FetchedData {
    error: string;
    data: Breach[] | PhoneNumberInfo | SocialMediaInfo[] | string;
}

function App() {
    const [emailVisibility, setEmailVisibility] = React.useState(true);
    const [phoneVisibility, setPhoneVisibility] = React.useState(true);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<Error>({isError: false, message: []});
    const [isResult, setIsResult] = React.useState(false);

    const [phoneData, setPhoneData] = React.useState<FetchedData>();
    const [emailData, setEmailData] = React.useState<FetchedData>();
    const [breachData, setBreachData] = React.useState<FetchedData>();

    useEffect(() => {
        if (phoneData != null && emailData != null && breachData != null) {
            setIsResult(true);
            setIsLoading(false);
        }

        let err = [];
        if (phoneData != null && phoneData.error.length > 0) {
            err.push(phoneData.error);
        }
        if (emailData != null && emailData.error.length > 0) {
            err.push(emailData.error);
        }
        if (breachData != null && breachData.error.length > 0) {
            err.push(breachData.error);
        }

        setError({isError: err.length > 1, message: err});
    }, [phoneData, emailData, breachData]);

    function back() {
        setIsResult(false);
    }

    function dataBreachCheck(email: string) {
        fetch(config.API_URL + '/check/breach', {
            method: 'POST',
            body: JSON.stringify({
                email: email,
            }),
        })
            .then((response) => response.json())
            .then(res => {
                if (res.status !== undefined) {
                    setBreachData({data: '', error: res.status});
                    return;
                }
                setBreachData({data: res as Breach[], error: ''});
            });
    }

    function phoneNumberCheck(phoneNumber: string) {
        fetch(config.API_URL + '/check/phonenumber', {
            method: 'POST',
            body: JSON.stringify({
                number: '+62' + phoneNumber,
            }),
        })
            .then((response) => response.json())
            .then(res => {
                if (res.status !== undefined) {
                    setPhoneData({data: '', error: res.status});
                    return;
                }
                setPhoneData({data: res as PhoneNumberInfo, error: ''});
            });
    }

    function emailCheck(email: string) {
        fetch(config.API_URL + '/check/email', {
            method: 'POST',
            body: JSON.stringify({
                email: email,
            }),
        }).then((response) => response.json()).then((res) => {
            if (res.status !== undefined) {
                setEmailData({data: '', error: res.status});
                return;
            }
            setEmailData({data: res as SocialMediaInfo[], error: ''});
        });
    }

    function onSubmit(values: Values) {
        try {
            setIsLoading(true);
            if (phoneVisibility) {
                phoneNumberCheck(values.phone);
            }

            if (emailVisibility) {
                emailCheck(values.email);
                dataBreachCheck(values.email);
            }
        } catch (e) {
            if (e instanceof Error) {
                setError({isError: true, message: [e.message]});
            }
        }
    }

    const formik = useFormik({
        initialValues: {
            email: '',
            phone: '',
        },
        onSubmit: onSubmit,
        validate: (values: Values) => {
            let errors: Partial<Values> = {};

            if (emailVisibility) {
                if (!values.email) {
                    errors.email = 'Email tidak boleh kosong';
                } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                    errors.email = 'Email tidak valid';
                }
            }

            if (phoneVisibility) {
                if (!values.phone) {
                    errors.phone = 'Nomor telepon tidak boleh kosong';
                } else if (!/^[0-9]{10,12}$/i.test(values.phone.toString().replace('+62', ''))) {
                    errors.phone = 'Nomor telepon tidak valid';
                }
            }

            return errors;
        }
    });

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
                                checked={emailVisibility}
                                onChange={() => setEmailVisibility(!emailVisibility)}
                            />
                        } label="Email"/>
                        <FormControlLabel control={
                            <Checkbox
                                checked={phoneVisibility}
                                onChange={() => setPhoneVisibility(!phoneVisibility)}
                            />
                        } label="Nomor Telepon"/>
                    </FormGroup>
                    <Box
                        component="form"
                        display="flex"
                        flexDirection="column"
                        alignItems="stretch"
                        gap={1.5}
                        onSubmit={formik.handleSubmit}
                    >
                        <TextField
                            id="email"
                            label="Email"
                            variant="outlined"
                            disabled={!emailVisibility}
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={emailVisibility && formik.touched.email && Boolean(formik.errors.email)}
                            helperText={emailVisibility && formik.touched.email && formik.errors.email}
                        />
                        <TextField
                            id="phone"
                            label="Nomor Telepon"
                            variant="outlined"
                            disabled={!phoneVisibility}
                            type="number"
                            InputProps={{
                                startAdornment: <InputAdornment position="start"
                                >+62</InputAdornment>,
                            }}
                            value={formik.values.phone}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={phoneVisibility && formik.touched.phone && Boolean(formik.errors.phone)}
                            helperText={phoneVisibility && formik.touched.phone && formik.errors.phone}
                        />
                        <LoadingButton
                            type="submit"
                            loading={isLoading}
                            disabled={!emailVisibility && !phoneVisibility}
                            variant="contained"
                            loadingPosition="end"
                            endIcon={<Search/>}
                            sx={{
                                height: '40px'
                            }}
                        >
                            {isLoading ? 'Mohon tunggu sebentar...' : 'Selidik'}
                        </LoadingButton>
                    </Box>
                </Grid>
            </Grid>
            <Dialog
                open={error.isError}
                onClose={() => setError({...error, isError: false})}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {'Terjadi kesalahan'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {error.message}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setError({...error, isError: false})}>Tutup</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default App;
