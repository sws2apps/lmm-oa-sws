import { promiseGetRecoil } from 'recoil-outside';
import { congIDState } from '../states/congregation';
import { apiHostState, userEmailState, visitorIDState } from '../states/main';

export const apiFetchPocketUser = async (id, abort) => {
  try {
    const userEmail = await promiseGetRecoil(userEmailState);
    const apiHost = await promiseGetRecoil(apiHostState);
    const visitorID = await promiseGetRecoil(visitorIDState);
    const congID = await promiseGetRecoil(congIDState);

    const res = await fetch(`${apiHost}api/congregations/${congID}/pockets/${id}`, {
      signal: abort,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        visitorid: visitorID,
        email: userEmail,
      },
    });

    const status = res.status;
    const data = await res.json();

    return { status, data };
  } catch (err) {
    throw new Error(err);
  }
};
