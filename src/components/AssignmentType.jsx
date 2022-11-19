import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import { styled, lighten, darken } from '@mui/system';
import Autocomplete from '@mui/material/Autocomplete';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { assTypeLocalNewState } from '../states/sourceMaterial';

const GroupHeader = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: '-8px',
  padding: '4px 10px',
  color: theme.palette.primary.main,
  backgroundColor:
    theme.palette.mode === 'light'
      ? lighten(theme.palette.primary.light, 0.85)
      : darken(theme.palette.primary.main, 0.8),
}));

const GroupItems = styled('ul')({
  padding: 0,
});

const AssignmentType = ({ student, assignable, currentType, handleChangeType }) => {
  const { t } = useTranslation();

  const assTypeList = useRecoilValue(assTypeLocalNewState);
  const [localList, setLocalList] = useState([]);
  const [isFemale, setIsFemale] = useState(false);

  useEffect(() => {
    setIsFemale(student.isFemale);
  }, [student.isFemale]);

  useEffect(() => {
    if (assignable) {
      let data = assTypeList.filter((assType) => assType.assignable === true);

      if (isFemale) {
        data = data.filter((assType) => assType.maleOnly !== true);
      }

      console.log(data);
      setLocalList(data);
    } else {
      setLocalList(assTypeList);
    }
  }, [assTypeList, assignable, isFemale]);

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
        <>
          <TextField
            id="outlined-select-type"
            select
            label={t('sourceMaterial.partType')}
            size="small"
            value={currentType}
            onChange={(e) => handleChangeType(e.target.value)}
            sx={{
              minWidth: '250px',
            }}
          >
            {localList.map((partType) => renderPartType(partType))}
          </TextField>
          <Autocomplete
            id="grouped-demo"
            options={localList}
            groupBy={(localList) => localList.type}
            getOptionLabel={(localList) => localList.label}
            renderInput={(params) => <TextField {...params} label={t('sourceMaterial.partType')} />}
            renderGroup={(params) => (
              <li>
                <GroupHeader>{params.group}</GroupHeader>
                <GroupItems>{params.children}</GroupItems>
              </li>
            )}
          />
        </>
      )}
    </>
  );
};

export default AssignmentType;
