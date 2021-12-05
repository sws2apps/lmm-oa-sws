import { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useEffect } from 'react';

const AppNotification = (props) => {
    const [open, setOpen] = useState(false);
    const [appSeverity, setAppSeverity] = useState("success");
    const [appMessage, setAppMessage] = useState("");

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        props.setOpen(false);
        setOpen(false);
    };

    useEffect(() => {
        setAppSeverity(props.appSeverity);
        setAppMessage(props.appMessage);
        setOpen(props.appSnackOpen);
        return (() => {
            //clean
        })
    }, [props])

    return ( 
        <>
            {appMessage && (
                <Snackbar
                    open={open}
                    autoHideDuration={6000}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert variant="filled" onClose={handleClose} severity={appSeverity}>
                        {appMessage}
                    </Alert>
                </Snackbar>
            )}
        </>
    );
}
 
export default AppNotification;