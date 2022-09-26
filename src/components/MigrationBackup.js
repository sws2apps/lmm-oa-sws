import { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import {
	apiHostState,
	isOnlineState,
	userEmailState,
	visitorIDState,
} from '../appStates/appSettings';
import { dbExportDataOnline } from '../indexedDb/dbUtility';
import { congIDState } from '../appStates/appCongregation';

const MigrationBackup = ({ handleSkipStep, handleNext }) => {
	const { t } = useTranslation();

	let abortCont = useMemo(() => new AbortController(), []);

	const isOnline = useRecoilValue(isOnlineState);
	const visitorID = useRecoilValue(visitorIDState);
	const apiHost = useRecoilValue(apiHostState);
	const userEmail = useRecoilValue(userEmailState);
	const congID = useRecoilValue(congIDState);

	const [isProcessing, setIsProcessing] = useState(false);
	const [errorTxt, setErrorTxt] = useState('');

	const launchSkip = () => {
		setErrorTxt('');
		abortCont.abort();
		handleSkipStep();
	};

	const handleBackup = async () => {
		try {
			setErrorTxt('');
			setIsProcessing(true);

			if (apiHost !== '') {
				const { dbPersons, dbSourceMaterial, dbSchedule, dbPocketTbl } =
					await dbExportDataOnline();

				const reqPayload = {
					cong_persons: dbPersons,
					cong_schedule: dbSchedule,
					cong_sourceMaterial: dbSourceMaterial,
					cong_swsPocket: dbPocketTbl,
				};

				const res = await fetch(
					`${apiHost}api/congregations/${congID}/backup`,
					{
						signal: abortCont.signal,
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							visitor_id: visitorID,
							email: userEmail,
						},
						body: JSON.stringify(reqPayload),
					}
				);

				const data = await res.json();

				if (res.status === 200) {
					setIsProcessing(false);
					handleNext();
					return;
				}

				setIsProcessing(false);
				setErrorTxt(data.message);
			}
		} catch (error) {
			setIsProcessing(false);
			setErrorTxt(error.message);
		}
	};

	useEffect(() => {
		return () => abortCont.abort();
	}, [abortCont]);

	return (
		<Box>
			<Typography>{t('migration.sendBackupDesc')}</Typography>

			{errorTxt.length > 0 && (
				<Box sx={{ marginTop: '15px' }}>
					<Typography sx={{ color: 'red', fontWeight: 'bold' }}>
						{errorTxt}
					</Typography>
				</Box>
			)}

			<Box sx={{ marginTop: '15px' }}>
				<Button
					variant='contained'
					sx={{ marginRight: '5px' }}
					onClick={launchSkip}
				>
					{t('migration.btnSkip')}
				</Button>
				<Button
					variant='contained'
					disabled={!isOnline || isProcessing}
					onClick={handleBackup}
				>
					<Box sx={{ display: 'flex', alignItems: 'center' }}>
						{isProcessing && (
							<CircularProgress
								disableShrink
								color='secondary'
								size={'25px'}
								sx={{ marginRight: '10px' }}
							/>
						)}
						{t('migration.btnBackup')}
					</Box>
				</Button>
			</Box>
		</Box>
	);
};

export default MigrationBackup;
