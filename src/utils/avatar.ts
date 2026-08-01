export const getUserAvatar = (user: {
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;
}) => {
  if (user.photoURL) {
    return { uri: user.photoURL };
  }
  return null; // Signals UI to render initial avatar
};

export const getUserInitials = (
  name?: string | null,
  email?: string | null,
): string => {
  if (name && name.trim().length > 0) {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return parts[0][0].toUpperCase();
  }

  if (email && email.length > 0) {
    return email[0].toUpperCase();
  }

  return "U";
};
