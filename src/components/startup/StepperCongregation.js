import { useEffect, useState } from "react";
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const StepperCongregation = (props) => {
    const [congName, setCongName] = useState("");
    const [congNumber, setCongNumber] = useState("");
    const [isErrorCongName, setIsErrorCongName] = useState(false);
    const [isErrorCongNumber, setIsErrorCongNumber] = useState(false);

    const handleCongNameChange = (value) => {
        if (value) {
            props.setIsErrorCongName(false);
        } else {
            props.setIsErrorCongName(true);
        }
        props.setCongName(value);
    }

    const handleCongNumberChange = (value) => {
        if (value) {
            props.setIsErrorCongNumber(false);
        } else {
            props.setIsErrorCongNumber(true);
        }
        props.setCongNumber(value);
    }

    useEffect(() => {
        setCongName(props.congName);
    }, [props.congName])

    useEffect(() => {
        setCongNumber(props.congNumber);
    }, [props.congNumber])

    useEffect(() => {
        setIsErrorCongName(props.isErrorCongName);
    }, [props.isErrorCongName])

    useEffect(() => {
        setIsErrorCongNumber(props.isErrorCongNumber);
    }, [props.isErrorCongNumber])

    return ( 
        <div>
            <Typography variant="body2" paragraph>Ampidiro eto ambany ny anaran’ny fiangonana sy nomerao</Typography>
            <TextField
                id="outlined-basic"
                label="Fiangonana"
                variant="outlined"
                size="small"
                autoComplete='off'
                required
                error={isErrorCongName ? true : false}
                helperText={isErrorCongName ? "Mila fenoina" : null}
                sx={{
                    width: '320px',
                    marginRight: '5px',
                    marginBottom: '10px',
                }}
                value={congName}
                onChange={(e) => handleCongNameChange(e.target.value)}
            />
            <TextField
                id="outlined-basic"
                type="number"
                label="Nomerao"
                variant="outlined"
                size="small"
                autoComplete='off'
                required
                error={isErrorCongNumber ? true : false}
                helperText={isErrorCongName ? "Mila fenoina" : null}
                sx={{width: '120px'}}
                value={congNumber}
                onChange={(e) => handleCongNumberChange(e.target.value)}
            />
        </div>
     );
}
 
export default StepperCongregation;