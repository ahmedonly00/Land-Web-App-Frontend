export const openWhatsApp = (phoneNumber, message = '') => {
  // Remove any non-numeric characters from phone number
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  
  // Encode the message for URL
  const encodedMessage = encodeURIComponent(message);
  
  // Create WhatsApp URL
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
  
  // Open in new window
  window.open(whatsappUrl, '_blank');
};

export const getPlotWhatsAppMessage = (plot) => {
  return `Hi, I'm interested in the ${plot.title} in ${plot.location}. Can you provide more information?`;
};

export const getHouseWhatsAppMessage = (house, settings) => {
  const features = house.features && house.features.length > 0 
    ? house.features.map(f => f.name || f).join(', ')
    : 'No specific features listed';
  
  return `Hi, I'm interested in the ${house.title} in ${house.location}.

Property Details:
- Type: ${house.type}
- Price: ${house.price} ${house.currency}
- Size: ${house.size} ${house.sizeUnit}
- Bedrooms: ${house.bedrooms}
- Bathrooms: ${house.bathrooms}
- Year Built: ${house.yearBuilt}
- Features: ${features}

Can you provide more information or schedule a viewing?`;
};

export const getGeneralWhatsAppMessage = () => {
  return `Hi, I'm interested in learning more about your land plots. Can you help me?`;
};
