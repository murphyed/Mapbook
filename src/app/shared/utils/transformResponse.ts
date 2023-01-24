export function transformResponse(res: any, latVal: number, lngVal: number) {
  const formattedAddress = {
    street: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    lat: latVal,
    lng: lngVal,
  };

  if (res.address_components) {
    res.address_components.forEach((component: any) => {
      if (component.types.includes('street_number')) {
        formattedAddress.street = `${component.long_name} ${formattedAddress.street}`;
      }
      if (component.types.includes('route')) {
        formattedAddress.street += component.long_name;
      }
      if (component.types.includes('locality')) {
        formattedAddress.city = component.long_name;
      }
      if (component.types.includes('administrative_area_level_1')) {
        formattedAddress.state = component.long_name;
      }
      if (component.types.includes('country')) {
        formattedAddress.country = component.long_name;
      }
      if (component.types.includes('postal_code')) {
        formattedAddress.zipCode = component.long_name;
      }
    });
  }

  return formattedAddress;
}
