import { MessageCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { openWhatsApp, getGeneralWhatsAppMessage } from '../../utils/whatsapp';

const WhatsAppButton = ({ phoneNumber, message, className = '', children, variant = 'whatsapp', size = 'default' }) => {
  const handleClick = () => {
    const msg = message || getGeneralWhatsAppMessage();
    openWhatsApp(phoneNumber, msg);
  };

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      size={size}
      className={className}
    >
      <MessageCircle size={20} className="mr-2" />
      {children || 'WhatsApp'}
    </Button>
  );
};

export default WhatsAppButton;
