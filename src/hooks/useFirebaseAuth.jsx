import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { dbSavePhotoAvatar } from '../indexedDb/dbUtility';

const useFirebaseAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });
  }, []);

  useEffect(() => {
    if (isAuthenticated) dbSavePhotoAvatar();
  }, [isAuthenticated]);

  return { isAuthenticated, user };
};

export default useFirebaseAuth;
