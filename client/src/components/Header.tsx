import React from 'react';
import {Box, Tooltip, Typography} from '@mui/material';

const logo = require('../logo.webp');

export default function Header() {
    return <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        sx={{
            cursor: 'default',
            textAlign: 'center'
        }}
    >
        <Tooltip title="github.com/bagaswastu/inspektur" arrow placement="top">
            <img src={logo} alt="logo" width="100px"/>
        </Tooltip>
        <Typography variant="h4" sx={{fontWeight: '500'}}>
            Inspektur
        </Typography>
        <Typography variant="h5" sx={{color: 'text.secondary'}}>
            Cek informasi email dan nomor telepon
        </Typography>
    </Box>;
}

