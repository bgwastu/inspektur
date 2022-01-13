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
    TextField,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import {Search} from '@mui/icons-material';
import Header from './components/Header';
import {useFormik} from 'formik';

interface Values {
    email: string;
    phone: string;
}

function App() {
    const [emailVisibility, setEmailVisibility] = React.useState(true);
    const [phoneVisibility, setPhoneVisibility] = React.useState(true);
    const [isLoading, setIsLoading] = React.useState(false);

    function onSubmit(values: Values) {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
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
                            Selidik
                        </LoadingButton>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
}

export default App;
