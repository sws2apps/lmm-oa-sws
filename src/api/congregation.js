import { getProfile } from './common';

export const apiFetchCountries = async () => {
  const { apiHost, appLang, userEmail, visitorID } = await getProfile();

  try {
    if (apiHost !== '') {
      const res = await fetch(`${apiHost}api/congregations/countries`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          email: userEmail,
          visitorid: visitorID,
          language: appLang.toUpperCase(),
        },
      });
      const data = await res.json();

      return { status: res.status, data };
    }
  } catch (err) {
    throw new Error(err);
  }
};

export const apiFetchCongregations = async (country, name) => {
  const { apiHost, userEmail, visitorID, appLang } = await getProfile();

  try {
    if (apiHost !== '') {
      const res = await fetch(`${apiHost}api/congregations/list-by-country`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          email: userEmail,
          visitorid: visitorID,
          language: appLang.toUpperCase(),
          country,
          name,
        },
      });
      const data = await res.json();

      return { status: res.status, data };
    }
  } catch (err) {
    throw new Error(err);
  }
};

export const apiCreateCongregation = async (country_code, cong_name, cong_number) => {
  const { apiHost, userEmail, visitorID } = await getProfile();

  try {
    if (apiHost !== '') {
      const res = await fetch(`${apiHost}api/congregations`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          email: userEmail,
          visitorid: visitorID,
        },
        body: JSON.stringify({ country_code, cong_name, cong_number, email: userEmail, app_requestor: 'lmmo' }),
      });
      const data = await res.json();

      return { status: res.status, data };
    }
  } catch (err) {
    throw new Error(err);
  }
};

export const apiUpdateCongregation = async (cong_id, country_code, cong_name, cong_number) => {
  const { apiHost, userEmail, visitorID } = await getProfile();

  try {
    if (apiHost !== '') {
      const res = await fetch(`${apiHost}api/congregations/${cong_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          email: userEmail,
          visitorid: visitorID,
        },
        body: JSON.stringify({ country_code, cong_name, cong_number }),
      });
      const data = await res.json();

      return { status: res.status, data };
    }
  } catch (err) {
    throw new Error(err);
  }
};
