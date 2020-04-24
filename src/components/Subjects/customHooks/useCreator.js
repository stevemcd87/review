import { useState, useEffect } from "react";

export default function useCreator(user, creator) {
  let [isCreator, setIsCreator] = useState(checkUser());

  useEffect(() => {
    setIsCreator(checkUser());
    return () => setIsCreator(null);
  }, [user]);

  return isCreator;

  function checkUser() {
    return user && user.username === creator ? true : false;
  }
}
