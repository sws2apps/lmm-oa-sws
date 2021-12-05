import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Container from '@mui/material/Container';
import ErrorIcon from '@mui/icons-material/Error';
import Typography from '@mui/material/Typography';
import { addEpubDataToDb, isValidEpubMWB } from "../epub/epubParser";

const sharedStyles = {
    epubLoad: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '70vh',
    },
    textCircular: {
        marginTop: '10px',
    },
};

const ImportEPUB = (props) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isComplete, setIsComplete] = useState(false);
    const [isValid, setIsValid] = useState(false);
    let history = useHistory();
    var fileEPUB = "";
    var mwbYear;
    if (props.location.state !== undefined) {
        fileEPUB = props.location.state.epubFile;
        mwbYear = fileEPUB.name;
        const toSplit = mwbYear.split("_");
        if (toSplit.length === 3) {
            mwbYear = mwbYear.split("_")[2];
            mwbYear = mwbYear.substring(0, 4);
        }
    }

    useEffect(() => {
        const validateEPUB = async () => {
            if (fileEPUB.type === "application/epub+zip") {
                const isMWB = await isValidEpubMWB(fileEPUB);
                if (isMWB === true) {
                    setIsValid(true);
                } else {
                    setIsValid(false);
                }
            } else {
                setIsValid(false);
            }
            setIsLoading(false);
        }

        validateEPUB();
        return (() => {
            //clean-up
        })
    }, [fileEPUB])

    useEffect(() => {
        const loadEPUB = async () => {
            await addEpubDataToDb(fileEPUB, mwbYear);
            setIsComplete(true);
            setTimeout(() => {
                history.push('/SourceMaterial');
            }, 2000);
        }

        if (isValid === true) {
            loadEPUB();
        };
        
        return (() => {
            //clean
        })
    }, [fileEPUB, isValid, mwbYear, history])

    if (fileEPUB === "") {
        history.push('/SourceMaterial');
    }

    return ( 
        <div>
            {(!isLoading && !isValid) && (
                <Container sx={sharedStyles.epubLoad}>
                    <ErrorIcon color="error" sx={{fontSize: '150px'}} />
                    <Typography variant="body1" align="center">
                        Tsy rakitra EPUB misy ny <em>Tari-dalana ho An’ny Fivoriana</em> io nosafidianao io, fa hamarino indray mandeha.
                    </Typography>
                </Container>
            )}
            {(!isLoading && isValid) && (
                <Container sx={sharedStyles.epubLoad}>
                    {!isComplete && (
                        <>
                            <CircularProgress color="secondary" size={'70px'} />
                            <Typography variant="body1" align="center" sx={sharedStyles.textCircular}>
                                Mampiditra ny rakitra EPUB. Miandrasa kely ...
                            </Typography>
                        </>
                    )}
                    {isComplete && (
                        <>
                            <CheckCircleIcon
                                color="success"
                                sx={{fontSize: '100px'}}
                            />
                            <Typography variant="body1" align="center" sx={sharedStyles.textCircular}>
                                Vita ny fampidirana ny loharanon-kevitra
                            </Typography>
                        </>
                    )}
                </Container>
            )}
        </div>
     );
}
 
export default ImportEPUB;