export const handleRoomNameFormatting = (roomUnique) => {
  let roomFormatted = roomUnique;
  roomFormatted = roomFormatted.split('_').slice(0, -1);
  roomFormatted = roomFormatted.join(' ');
  return roomFormatted;
};
