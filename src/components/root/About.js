import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';

const About = (props) => {
    const { isAboutOpen } = props;
    const [isOpen, setIsOpen] = useState(false);

    const handleClose = () => {
        props.openAbout(false);
    }

    useEffect(() => {
        setIsOpen(isAboutOpen);
    }, [isAboutOpen])

    return ( 
        <Dialog
            open={isOpen}
            onClose={handleClose}
            sx={{maxWidth: '500px', margin: 'auto'}}
        >
            <DialogContent sx={{padding: '10px'}}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <img src="/img/appLogo.png" alt="App logo" className="appLogoMini" />
                    <Typography
                        sx={{
                            fontWeight: 'bold',
                            marginTop: '5px',
                        }}
                    >
                        LMM-OA
                    </Typography>
                    <Typography variant="body1">{process.env.REACT_APP_VERSION}</Typography>
                </Box>
                <Box>
                    <Typography
                        variant="body2"
                        sx={{
                            marginTop: '10px',
                            marginBottom: '10px',
                        }}
                    >
                        Programa fandaminana anjaran’ny mpianatra amin’ny fivoriana andavanandro ny LMM-OA (Life and Ministry Meeting Overseer Assistant).
                    </Typography>
                    <Typography variant="body2">Copyright © 2021 | LMM-OA [SWS]</Typography>
                </Box>
            </DialogContent>
        </Dialog>
     );
}
 
export default About;