// FloatingWhatsAppComponent.js
import React from 'react';
import { FloatingWhatsApp } from 'react-floating-whatsapp';

const FloatingWhatsAppComponent = () => {
    const avatarImageUrl = "../images/web_pics/favicon.png"; 
  return (
    <FloatingWhatsApp
      phoneNumber="7777871717" 
      accountName="Gohoardings" 
      avatar={avatarImageUrl}
      darkMode={false} 
    
    />
  );
};

export default FloatingWhatsAppComponent;
