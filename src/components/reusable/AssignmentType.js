import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { assTypeLocalNewState } from '../../appStates/appSourceMaterial';

const AssignmentType = ({ assignable, currentType, handleChangeType }) => {
	const { t } = useTranslation();

	const assTypeList = useRecoilValue(assTypeLocalNewState);
	const [localList, setLocalList] = useState([]);

	useEffect(() => {
		if (assignable) {
			const data = assTypeList.filter((assType) => assType.assignable === true);
			setLocalList(data);
		} else {
			setLocalList(assTypeList);
		}
	}, [assTypeList, assignable]);

	const renderPartType = (type) => {
		return (
			<MenuItem key={type.value} value={type.value}>
				{type.label}
			</MenuItem>
		);
	};

	return (
		<>
			{localList.length > 0 && (
				<TextField
					id='outlined-select-type'
					select
					label={t('sourceMaterial.partType')}
					size='small'
					value={currentType}
					onChange={(e) => handleChangeType(e.target.value)}
					sx={{
						minWidth: '250px',
					}}
				>
					{localList.map((partType) => renderPartType(partType))}
				</TextField>
			)}
		</>
	);
};

export default AssignmentType;
