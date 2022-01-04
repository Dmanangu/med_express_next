export const mapUserData = (user) => {
  const { uid, email, xa, displayName } = user;
  return {
    id: uid,
    email,
    token: xa,
    name: displayName,
  };
};
