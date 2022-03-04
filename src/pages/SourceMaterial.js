import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { fileDialog } from 'file-select-dialog';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import ImportEPUB from '../components/sourceMaterial/ImportEPUB';
import WeekDetails from '../components/sourceMaterial/WeekDetails';
import WeekList from '../components/sourceMaterial/WeekList';
import {
	appMessageState,
	appSeverityState,
	appSnackOpenState,
} from '../appStates/appNotification';
import { appLangState } from '../appStates/appSettings';
import {
	currentWeekState,
	epubFileState,
	isImportEPUBState,
} from '../appStates/appSourceMaterial';
import {
	dbAddManualSource,
	dbSaveSrcData,
} from '../indexedDb/dbSourceMaterial';

const SourceMaterial = () => {
	const { t } = useTranslation();

	const [isImport, setIsImport] = useRecoilState(isImportEPUBState);

	const currentWeek = useRecoilValue(currentWeekState);
	const appLang = useRecoilValue(appLangState);

	const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
	const setAppSeverity = useSetRecoilState(appSeverityState);
	const setAppMessage = useSetRecoilState(appMessageState);
	const setEpubFile = useSetRecoilState(epubFileState);

	const handleWeekAdd = async () => {
		await dbAddManualSource();
		setAppSnackOpen(true);
		setAppSeverity('success');
		setAppMessage(t('sourceMaterial.weekAdded'));
	};

	const handleImportEPUB = async () => {
		const file = await fileDialog({
			accept: '.epub',
			strict: true,
		});
		console.log(file);
		const epubLang = file.name.split('_')[1];
		if (epubLang && epubLang === appLang.toUpperCase()) {
			setEpubFile(file);
			setIsImport(true);
		} else {
			setAppSnackOpen(true);
			setAppSeverity('warning');
			setAppMessage(t('sourceMaterial.invalidFilename'));
		}
	};

	const handleSaveSource = async (data) => {
		const isSaved = await dbSaveSrcData(data);
		if (isSaved === true) {
			setAppSnackOpen(true);
			setAppSeverity('success');
			setAppMessage(t('sourceMaterial.weekSaved'));
		} else {
			setAppSnackOpen(true);
			setAppSeverity('error');
			setAppMessage(t('sourceMaterial.saveError'));
		}
	};

	return (
		<>
			{isImport && <ImportEPUB />}
			<Box
				sx={{
					marginRight: '5px',
					marginTop: '10px',
				}}
			>
				<WeekList />
				{currentWeek !== '' && (
					<WeekDetails
						currentWeek={currentWeek}
						handleWeekAdd={handleWeekAdd}
						handleImportEPUB={handleImportEPUB}
						handleSaveSource={handleSaveSource}
					/>
				)}
			</Box>
		</>
	);
};

export default SourceMaterial;
