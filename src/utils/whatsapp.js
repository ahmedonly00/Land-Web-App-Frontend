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

export const getGeneralWhatsAppMessage = () => {
  return `Hi, I'm interested in learning more about your land plots. Can you help me?`;
};
