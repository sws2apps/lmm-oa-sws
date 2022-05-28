import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Typography from '@mui/material/Typography';
import DialogDbDeletion from './DialogDbDeletion';
import { isDeleteDbOpenState } from '../../appStates/appSettings';

const DataStorage = () => {
	const { t } = useTranslation();

	const setIsDeleteDb = useSetRecoilState(isDeleteDbOpenState);

	const handleDelete = () => {
		setIsDeleteDb(true);
	};

	useEffect(() => {
		setIsDeleteDb(false);
	}, [setIsDeleteDb]);

	return (
		<>
			<DialogDbDeletion />
			<Typography variant='h6' color='primary' className={'settingHeader'}>
				{t('settings.dataStorage')}
			</Typography>
			<div className={'settingSubItem'}>
				<Box>
					<Typography variant='body2'>{t('settings.eraseDesc')}</Typography>
				</Box>
				<Button
					variant='contained'
					color='error'
					className={'btnSubItem'}
					startIcon={<DeleteForeverIcon />}
					onClick={() => handleDelete()}
				>
					{t('global.delete')}
				</Button>
			</div>
		</>
	);
};

export default DataStorage;
