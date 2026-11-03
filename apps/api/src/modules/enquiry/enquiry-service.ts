import { prisma } from '../../db';
import { CONFIG } from '../../config';
import { EnquiryFormDTO } from '@kahvi-panda/shared';

export interface EnquiryDispatchResult {
  success: boolean;
  referenceNumber: string;
  enquiryId: string;
  whatsAppStatus: 'SENT' | 'QUEUED' | 'FALLBACK_CLICK';
  whatsAppClickUrl: string;
  message: string;
}

export class EnquiryService {
  static async submitEnquiry(data: EnquiryFormDTO): Promise<EnquiryDispatchResult> {
    // Generate unique human-readable reference number, e.g. KP-26-XXXXX
    const refNumber = `KP-${new Date().getFullYear().toString().slice(-2)}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // 1. Persist enquiry into database
    const enquiry = await prisma.enquiry.create({
      data: {
        referenceNumber: refNumber,
        name: data.name,
        phone: data.phone,
        email: data.email,
        type: data.type || 'GENERAL',
        subject: data.subject,
        message: data.message,
        businessName: data.businessName,
        city: data.city,
        estimatedMonthlyKg: data.estimatedMonthlyKg,
        productsOfInterest: data.productsOfInterest,
        whatsAppStatus: 'QUEUED'
      }
    });

    // 2. Format official WhatsApp notification payload (Asia/Kolkata timezone)
    const timestampIST = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short'
    });

    const lines = [
      `🐼 *NEW KAHVI PANDA ENQUIRY*`,
      `*Reference:* ${refNumber}`,
      `*Name:* ${data.name}`,
      `*Phone:* ${data.phone}`,
      `*Email:* ${data.email}`,
      `*Type:* ${data.type || 'General'}`,
      `*Subject:* ${data.subject}`,
      `*Message:* ${data.message}`
    ];

    if (data.businessName) {
      lines.push(`*Business:* ${data.businessName}`);
    }
    if (data.city) {
      lines.push(`*City:* ${data.city}`);
    }
    if (data.estimatedMonthlyKg) {
      lines.push(`*Estimated Monthly Volume:* ${data.estimatedMonthlyKg} kg`);
    }
    if (data.productsOfInterest) {
      lines.push(`*Products of Interest:* ${data.productsOfInterest}`);
    }

    lines.push(`*Submitted:* ${timestampIST}`);
    lines.push(`*Source:* Kahvi Panda Website`);

    const formattedMessage = lines.join('\n');

    // 3. Generate click-to-chat fallback URL
    const encodedText = encodeURIComponent(formattedMessage);
    const clickUrl = `https://wa.me/${CONFIG.WHATSAPP.TARGET_PHONE}?text=${encodedText}`;

    // 4. Attempt WhatsApp Business API dispatch if credentials exist
    let status: 'SENT' | 'QUEUED' | 'FALLBACK_CLICK' = 'FALLBACK_CLICK';

    if (CONFIG.WHATSAPP.API_TOKEN && CONFIG.WHATSAPP.PHONE_NUMBER_ID) {
      try {
        const response = await fetch(`https://graph.facebook.com/v18.0/${CONFIG.WHATSAPP.PHONE_NUMBER_ID}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${CONFIG.WHATSAPP.API_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: CONFIG.WHATSAPP.TARGET_PHONE,
            type: 'text',
            text: { preview_url: false, body: formattedMessage }
          })
        });

        if (response.ok) {
          status = 'SENT';
          await prisma.notificationDelivery.create({
            data: {
              enquiryId: enquiry.id,
              channel: 'WHATSAPP',
              recipient: CONFIG.WHATSAPP.TARGET_PHONE,
              payload: formattedMessage,
              status: 'DELIVERED'
            }
          });
        } else {
          status = 'QUEUED';
        }
      } catch (err) {
        console.error('WhatsApp API dispatch failed, fallback active:', err);
        status = 'QUEUED';
      }
    }

    // Update enquiry record with actual notification outcome
    await prisma.enquiry.update({
      where: { id: enquiry.id },
      data: { whatsAppStatus: status }
    });

    return {
      success: true,
      referenceNumber: refNumber,
      enquiryId: enquiry.id,
      whatsAppStatus: status,
      whatsAppClickUrl: clickUrl,
      message: 'Enquiry recorded successfully.'
    };
  }

  static async getEnquiries(type?: string) {
    return prisma.enquiry.findMany({
      where: type ? { type } : undefined,
      orderBy: { createdAt: 'desc' }
    });
  }

  static async updateEnquiryStatus(id: string, notes?: string, whatsAppStatus?: string) {
    return prisma.enquiry.update({
      where: { id },
      data: {
        notes,
        whatsAppStatus
      }
    });
  }
}
