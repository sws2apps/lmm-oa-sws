import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import WhatsNewDetail from '../whatsnew/WhatsNewDetail';
import WhatsNewItem from '../whatsnew/WhatsNewItem';
import {
	apiHostState,
	isOnlineState,
	isWhatsNewOpenState,
} from '../../appStates/appSettings';

const WhatsNew = () => {
	const { t } = useTranslation();
	let abortCont = useMemo(() => new AbortController(), []);

	const [isOpen, setIsOpen] = useRecoilState(isWhatsNewOpenState);

	const apiHost = useRecoilValue(apiHostState);
	const isOnline = useRecoilValue(isOnlineState);

	const [isProcessing, setIsProcessing] = useState(true);
	const [announcements, setAnnouncements] = useState([]);
	const [item, setItem] = useState({});
	const [isView, setIsView] = useState(false);

	const handleClose = () => {
		setIsOpen(false);
	};

	const handleGetAnnouncements = useCallback(async () => {
		if (isOnline && apiHost !== '') {
			setIsProcessing(true);
			const res = await fetch(`${apiHost}api/user/announcement`, {
				signal: abortCont.signal,
				method: 'GET',
			});

			const data = await res.json();
			setAnnouncements(data);
			setIsProcessing(false);
		}
	}, [abortCont, apiHost, isOnline]);

	useEffect(() => {
		handleGetAnnouncements();
	}, [handleGetAnnouncements]);

	useEffect(() => {
		if (!isOnline) {
			setIsProcessing(false);
		}
	}, [isOnline]);

	return (
		<Box>
			<Dialog
				open={isOpen}
				aria-labelledby='dialog-title-announcement-edit'
				onClose={handleClose}
			>
				<DialogTitle id='dialog-title-announcement-edit'>
					{isProcessing && (
						<Typography variant='h6' component='p'>
							{t('global.pleaseWait')}
						</Typography>
					)}
					{!isProcessing && (
						<Typography
							variant='h6'
							component='p'
							sx={{ borderBottom: '1px outset' }}
						>
							{t('global.whatsNew')}
						</Typography>
					)}
				</DialogTitle>
				<DialogContent>
					{isProcessing && (
						<Container
							sx={{
								display: 'flex',
								justifyContent: 'center',
								padding: '10px 50px',
							}}
						>
							<CircularProgress disableShrink color='secondary' size={'60px'} />
						</Container>
					)}
					{!isOnline && !isProcessing && (
						<Typography sx={{ fontSize: '14px' }}>
							{t('global.offlineWhatsNew')}
						</Typography>
					)}
					{isOnline && !isProcessing && announcements.length === 0 && (
						<Typography sx={{ fontSize: '14px' }}>
							{t('global.nothingNew')}
						</Typography>
					)}
					{isOnline && !isProcessing && announcements.length > 0 && (
						<>
							{isView && (
								<WhatsNewDetail
									announcement={item}
									setItem={(value) => setItem(value)}
									setIsView={(value) => setIsView(value)}
								/>
							)}
							{!isView && (
								<Box sx={{ width: '350px' }}>
									{announcements.map((announcement) => (
										<WhatsNewItem
											key={announcement.id}
											announcement={announcement}
											setItem={(value) => setItem(value)}
											setIsView={(value) => setIsView(value)}
										/>
									))}
								</Box>
							)}
						</>
					)}
				</DialogContent>
			</Dialog>
		</Box>
	);
};

export default WhatsNew;
