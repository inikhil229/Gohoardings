import React from 'react';
import Fixednavbar from '@/components/navbar/fixednavbar';

const RefundPolicy = () => {
  return (
    <>
    <Fixednavbar/>
    <div className="refund-policy container my-5 pt-5">
      <h2 >Refund Policy:</h2>
      <p>At Gohoardings Solution LLP, we strive to provide the best services and products to our valued customers. While we do not offer refunds for our regular products or services, we understand that errors can occasionally occur. Therefore, we have established a policy to address situations where extra or duplicate payments are made.</p>

      <h3>Refund Process:</h3>
      <p><strong>Refund Eligibility:</strong> We will process refunds only for instances where extra or dual payments have been deducted due to an error or technical glitch. Regular product or service payments are non-refundable.</p>

      <p><strong>Notification:</strong> If you believe that you have made an extra or dual payment, please contact us immediately. You can either email us at alerts@gohoardings.com or call our customer support team at +91 7777871717.</p>

      <p><strong>Provide Proof:</strong> To initiate a refund request, you will need to provide a clear and legible screenshot of the transaction in question. Please ensure that all relevant details, such as the transaction amount, date, and payment method, are clearly visible in the screenshot.</p>

      <p><strong>Processing Time:</strong> Once we receive your refund request and the necessary documentation, we will review it promptly. Refunds will typically be processed within 4-5 business days from the date of your request, provided that the eligibility criteria are met.</p>

      <p><strong>Refund Method:</strong> Refunds will be credited back to the original payment method used for the transaction.</p>

      <h3>Note:</h3>
      <p>Gohoardings Solution LLP reserves the right to decline refund requests that do not meet the eligibility criteria as stated above.</p>
      <p>Refunds will be processed as quickly as possible, but the time it takes for the refunded amount to appear in your account may vary depending on your financial institution.</p>
      <p>In case of any disputes or further inquiries, please do not hesitate to reach out to our customer support team for assistance.</p>

      <h3>Contact Information:</h3>
      <p>Email: alerts@gohoardings.com</p>
      <p>Phone: +91 7777871717</p>

      <p>We value your satisfaction and appreciate your business. Thank you for choosing Gohoardings Solution LLP.</p>
    </div>
    </>
  );
};

<style jsx>{`
        .container {
          font-family: Arial, sans-serif;
          padding: 20px;
          background-color: #f5f5f5;
          border: 1px solid #ccc;
          border-radius: 5px;
          margin: 20px;
        }

        h2 {
          font-size: 24px;
          color: #333;
        }

        h3 {
          font-size: 18px;
          color: #555;
          margin-top: 20px;
        }

        p {
          font-size: 16px;
          color: #777;
          margin-bottom: 10px;
        }

        strong {
          font-weight: bold;
          color: #000;
        }

        .contact-info {
          margin-top: 20px;
          font-size: 16px;
        }

        a {
          color: #0073e6;
        }
      `}</style>

export default RefundPolicy;
