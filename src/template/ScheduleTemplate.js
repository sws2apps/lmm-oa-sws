import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import html2pdf from 'html2pdf.js';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import Typography from '@mui/material/Typography';
import { dbGetScheduleForPrint } from '../indexedDb/dbAssignment';
import {
	classCountState,
	congNameState,
	congNumberState,
} from '../appStates/appCongregation';
import { currentScheduleState } from '../appStates/appSchedule';
import { monthNamesState } from '../appStates/appSettings';

const ScheduleTemplate = () => {
	let navigate = useNavigate();
	const { t } = useTranslation();

	const [data, setData] = useState([]);
	const [month, setMonth] = useState('');

	const currentSchedule = useRecoilValue(currentScheduleState);
	const classCount = useRecoilValue(classCountState);
	const congName = useRecoilValue(congNameState);
	const congNumber = useRecoilValue(congNumberState);
	const monthNames = useRecoilValue(monthNamesState);

	const savePDF = () => {
		const element = document.getElementById('schedule_template');
		var opt = {
			margin: [0.2, 0.5, 0.2, 0.5],
			filename: `${currentSchedule.replace('/', '-')}.pdf`,
			image: { type: 'jpeg', quality: 0.98 },
			html2canvas: { scale: 2 },
			jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
		};
		html2pdf().set(opt).from(element).save();
	};

	useEffect(() => {
		const getData = async () => {
			const month = currentSchedule.split('/')[0];

			const monthName = monthNames[+month - 1];
			setMonth(monthName);

			const data = await dbGetScheduleForPrint(currentSchedule);
			setData(data);
		};

		if (currentSchedule === '') {
			navigate('/Schedule');
		} else {
			getData();
		}
	}, [navigate, currentSchedule, monthNames]);

	return (
		<p></p>
	);
};

export default ScheduleTemplate;
