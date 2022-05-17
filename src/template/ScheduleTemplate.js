import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
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

	const [data, setData] = useState([]);
	const [month, setMonth] = useState('');

	const currentSchedule = useRecoilValue(currentScheduleState);
	const classCount = useRecoilValue(classCountState);
	const congName = useRecoilValue(congNameState);
	const congNumber = useRecoilValue(congNumberState);
	const monthNames = useRecoilValue(monthNamesState);

	console.log(data, month, classCount, congName, congNumber)

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
