export const getShortenedHotelName = (hotelName: string): string => {
  return hotelName[0].toUpperCase() + (hotelName[1] ? hotelName[1].toLowerCase() : '');
};
