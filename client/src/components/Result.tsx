import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Avatar,
    Box,
    Button,
    Grid,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Stack,
    Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PhoneIcon from '@mui/icons-material/Phone';
import React from 'react';
import {ResponseData} from '../types';
import {formatRelative} from 'date-fns';
import {id} from 'date-fns/locale';
import {ArrowBackIosNew} from '@mui/icons-material';

interface Props {
    data: ResponseData;

    goBack(): void;
}

function getFavicon(domain: string): string {
    return `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=32`;
}

const Result = (props: Props) => {
    const {email, phone_number, breach, telegram} = props.data;

    if (!email && !phone_number && !breach && !telegram) {
        return (
            <Stack
                direction="column"
                justifyContent="center"
                alignItems="stretch"
                marginTop={10}
            >

                <Typography variant="body1" sx={{color: 'text.secondary', fontSize: '1.2rem'}}>
                    Tidak ditemukan data.
                </Typography>
                <Button variant="contained" startIcon={<ArrowBackIosNew/>} color="primary" sx={{marginTop: '16px'}}
                        onClick={() =>
                            props.goBack()
                        }>Kembali
                </Button>

            </Stack>
        );
    }

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="stretch"
            justifyContent="center"
        >
            <Box
                display="flex"
                justifyContent="center"
            >
                <Button variant="outlined" color="primary" sx={{marginBottom: '16px'}} onClick={() =>
                    props.goBack()
                }>
                    Kembali
                </Button>
            </Box>
            <Box>
                <Accordion disabled={!email || email?.length < 1}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                    >
                        <Typography sx={{width: '33%', flexShrink: 0}}>
                            Email
                        </Typography>
                        <Typography
                            sx={{color: 'text.secondary'}}>{email && email?.length > 1 ? 'Terdapat ' + email?.length + ' akun yang terdaftar': 'Tidak ada data'}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={2} direction="row" alignItems="space-around">
                            {email?.map(data => {
                                return <Grid item key={data.name}>
                                    <ListItem sx={{maxWidth: '10em', minWidth: '10em'}}>
                                        <ListItemAvatar>
                                            <Avatar src={getFavicon(data.domain)} variant="square"/>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={data.name}
                                            secondary={data.domain}
                                        />
                                    </ListItem>
                                </Grid>;
                            })}

                        </Grid>
                    </AccordionDetails>
                </Accordion>
                <Accordion
                    disabled={!phone_number}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="panel2bh-content"
                        id="panel2bh-header"
                    >
                        <Typography sx={{width: '33%', flexShrink: 0}}>No Telepon</Typography>
                        <Typography sx={{color: 'text.secondary'}}>
                            {phone_number ? 'Terdapat ' + phone_number?.datas?.length + ' akun yang terdaftar' : 'Tidak ada data'}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <ListItem
                        >
                            <ListItemAvatar>
                                <Avatar sx={{bgcolor: 'primary.main'}}>
                                    <PhoneIcon/>
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={'Operator'}
                                secondary={phone_number?.operator}
                            />
                        </ListItem>
                        <Grid container spacing={2} direction="row">
                            {phone_number?.datas?.map(data => {
                                return <Grid item xs={6} key={data.name}>
                                    <ListItem>
                                        <ListItemAvatar>
                                            <Avatar src={getFavicon(data.domain)}/>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={data.name}
                                            secondary={data.domain}
                                        />
                                    </ListItem>
                                </Grid>;
                            })}
                        </Grid>
                    </AccordionDetails>
                </Accordion>
                <Accordion
                    disabled={!telegram?.id}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="panel3bh-content"
                        id="panel3bh-header"
                    >
                        <Typography sx={{width: '33%', flexShrink: 0}}>
                            Telegram
                        </Typography>
                        <Typography sx={{color: 'text.secondary'}}>
                            {telegram?.id ? 'Info akun Telegram': 'Tidak ada data'}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <ListItem>
                            <ListItemText
                                primary="Status"
                                secondary={telegram?.status}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="Terakhir Online"
                                secondary={telegram?.last_online ? formatRelative(new Date(telegram.last_online), new Date(), {locale: id}) : ''}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="Username"
                                secondary={telegram?.username ? telegram.username : 'Tidak terdeteksi'}
                            />
                        </ListItem>

                        <ListItem>
                            <ListItemText
                                primary="Telegram Id"
                                secondary={telegram?.id}
                            />
                        </ListItem>
                    </AccordionDetails>
                </Accordion>
                <Accordion
                    disabled={!breach}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="panel4bh-content"
                        id="panel4bh-header"
                    >
                        <Typography sx={{width: '33%', flexShrink: 0}}>Data Bocor</Typography>
                        <Typography sx={{color: 'text.secondary'}}>
                            {breach ?'Terdapat ' + breach?.length + ' data yang bocor': 'Tidak ada data'}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {breach?.map(data => {
                            return <ListItem key={data.title}>
                                <ListItemAvatar>
                                    <img src={data.img} style={{
                                        width: '40px', marginRight: '18px'
                                    }} alt={data.title}/>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={data.title}
                                    secondary={data.breached_data}
                                />
                            </ListItem>;
                        })}
                    </AccordionDetails>
                </Accordion>
            </Box>
        </Box>);
};

export default Result;