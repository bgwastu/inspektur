import React from 'react';
import {Box, Checkbox, FormControlLabel, FormGroup, InputAdornment, TextField} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import {Search} from '@mui/icons-material';
import {useFormik} from 'formik';

import {State} from '../App';
import {Payload} from '../types';

interface Props {
    state: State;
    onSubmit: (values: Payload, emailVisibility: boolean, phoneVisibility: boolean) => void;
}

function MainForm(props: Props) {
    const [emailVisibility, setEmailVisibility] = React.useState(true);
    const [phoneVisibility, setPhoneVisibility] = React.useState(true);

    const formik = useFormik<Payload>({
        initialValues: {
            email: '',
            phone: '',
        },
        onSubmit: (values, _) => {
            props.onSubmit(values, emailVisibility, phoneVisibility);
        },
        validate: (payload: Payload) => {
            let errors: Partial<Payload> = {};

            if (emailVisibility) {
                if (!payload.email) {
                    errors.email = 'Email tidak boleh kosong';
                } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(payload.email)) {
                    errors.email = 'Email tidak valid';
                }
            }

            if (phoneVisibility) {
                if (!payload.phone) {
                    errors.phone = 'Nomor telepon tidak boleh kosong';
                } else if (!/^[0-9]{10,12}$/i.test(payload.phone.toString().replace('+62', ''))) {
                    errors.phone = 'Nomor telepon tidak valid';
                }
            }

            return errors;
        }
    });


    return (<>
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
                loading={props.state.isLoading}
                disabled={!emailVisibility && !phoneVisibility}
                variant="contained"
                loadingPosition="end"
                endIcon={<Search/>}
                sx={{
                    height: '40px'
                }}
            >
                {props.state.isLoading ? 'Mohon tunggu sebentar...' : 'Selidik'}
            </LoadingButton>
        </Box>
    </>);
}

export default MainForm;