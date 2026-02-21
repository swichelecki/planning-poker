export const handleRoomNameFormatting = (roomUnique) =>
  roomUnique.split('_').slice(0, -1).join(' ');
