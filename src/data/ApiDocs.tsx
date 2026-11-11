/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ApiEndpoint {
  title: string;
  description?: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  contentType?: string;
  auth?: string;
  payload?: any;
  notes?: string;
  fields?: { name: string; type: string; required?: boolean; description: string }[];
  response?: any;
}

export interface ApiSection {
  id: string;
  title: string;
  description: string;
  endpoints: ApiEndpoint[];
}

export const API_DOCS: ApiSection[] = [
  {
    id: "conversational",
    title: "Interactive Messaging API",
    description: "Deliver engaging messages to your contacts",
    endpoints: [
      {
        title: "Send Text Message",
        description: "Note: `contact_no` is the receiver's phone number, and `whatsapp_phone_number` is the sender's registered phone number. Ensure that a WABA is connected with this sender number for the request to work.",
        method: "POST",
        path: "/api/whatsapp/send",
        contentType: "application/json",
        payload: {
          contact_no: "919876543210",
          whatsapp_phone_number: "911234567890",
          messageType: "text",
          message: "Hello! How can I help you today?",
        },
        response: {
          success: true,
          message: "Message sent successfully!",
          data: {
            id: "64a1b2c3d4e5f6789abcdef9",
            wa_message_id: "wamid.XXXXXXXXXXXX",
          },
        },
      },
      {
        title: "Upload Image (URL)",
        method: "POST",
        path: "/api/whatsapp/send",
        contentType: "application/json",
        payload: {
          contact_no: "919876543210",
          whatsapp_phone_number: "911234567890",
          messageType: "image",
          message: "Check this out!",
          mediaUrl: "https://example.com/image.jpg",
        },
        response: {
          success: true,
          message: "Message sent successfully!",
          data: {
            id: "64a1b2c3d4e5f6789abcdef9",
            wa_message_id: "wamid.XXXXXXXXXXXX",
          },
        },
      },
      {
        title: "Send Media from Local Device",
        method: "POST",
        path: "/api/whatsapp/send",
        contentType: "multipart/form-data",
        payload: {
          file_url: "(binary)",
          whatsapp_phone_number_id: "69dcc448629a287a66cdfc8b",
          contact_id: "697f22fc2f2ef5e92a7cdf9a",
          message: "",
          provider: "business_api",
          messageType: "image",
        },
        response: {
          success: true,
          message: "Media sent successfully!",
          data: { id: "64a1b2c3d4e5f6789abcdef9" },
        },
      },
      {
        title: "Upload Document (URL)",
        method: "POST",
        path: "/api/whatsapp/send",
        contentType: "application/json",
        payload: {
          contact_no: "919876543210",
          whatsapp_phone_number: "911234567890",
          messageType: "document",
          message: "Please read the attached report",
          mediaUrl: "https://example.com/report.pdf",
        },
        response: {
          success: true,
          message: "Message sent successfully!",
          data: { id: "64a1b2c3d4e5f6789abcdef9" },
        },
      },
      {
        title: "Send Audio via URL",
        method: "POST",
        path: "/api/whatsapp/send",
        contentType: "application/json",
        payload: {
          contact_no: "919876543210",
          whatsapp_phone_number: "911234567890",
          messageType: "audio",
          mediaUrl: "https://example.com/audio.mp3",
        },
        response: {
          success: true,
          message: "Message sent successfully!",
          data: { id: "64a1b2c3d4e5f6789abcdef9" },
        },
      },
      {
        title: "Send Video via URL",
        method: "POST",
        path: "/api/whatsapp/send",
        contentType: "application/json",
        payload: {
          contact_no: "919876543210",
          whatsapp_phone_number: "911234567890",
          messageType: "video",
          message: "Watch this!",
          mediaUrl: "https://example.com/video.mp4",
        },
        response: {
          success: true,
          message: "Message sent successfully!",
          data: { id: "64a1b2c3d4e5f6789abcdef9" },
        },
      },
      {
        title: "Send Multiple Media via URLs",
        description:
          "Sends multiple media files in sequence using public URLs.",
        method: "POST",
        path: "/api/whatsapp/send",
        contentType: "application/json",
        payload: {
          contact_no: "919876543210",
          whatsapp_phone_number: "911234567890",
          mediaUrls: [
            "https://example.com/image1.jpg",
            "https://example.com/image2.png",
            "https://example.com/video.mp4",
          ],
          message: "Here are your files!",
        },
        response: {
          success: true,
          message: "3 messages sent successfully!",
          results: [
            { id: "64a1b2c3d4e5f6789abcd001", success: true },
            { id: "64a1b2c3d4e5f6789abcd002", success: true },
            { id: "64a1b2c3d4e5f6789abcd003", success: true },
          ],
        },
      },
      {
        title: "Share Location Info",
        method: "POST",
        path: "/api/whatsapp/send",
        contentType: "application/json",
        payload: {
          contact_no: "919876543210",
          whatsapp_phone_number: "911234567890",
          messageType: "location",
          location: {
            latitude: 28.6139,
            longitude: 77.209,
            name: "New Delhi",
            address: "New Delhi, India",
          },
        },
        response: {
          success: true,
          message: "Location sent successfully!",
          data: { id: "64a1b2c3d4e5f6789abcdef9" },
        },
      },
    ],
  },
  {
    id: "template",
    title: "Messaging Templates API",
    description: "Manage and send predefined WhatsApp message templates.",
    endpoints: [
      {
        title: "Simple Template",
        method: "POST",
        path: "/api/templates/create",
        contentType: "application/json",
        payload: {
          waba_id: "1248119146671221",
          template_name: "simple_announcement",
          category: "MARKETING",
          language: "en_US",
          message_body: "This is a simple announcement for the season.",
          footer_text: "Thank you"
        },
        response: {
          success: true,
          message: "Template submitted!",
          template_id: "64a1b2c3d4e5f6789abcdef9"
        }
      },
      {
        title: "Template with Variables",
        method: "POST",
        path: "/api/templates/create",
        contentType: "application/json",
        payload: {
          waba_id: "1248119146671221",
          template_name: "welcome_offer",
          category: "MARKETING",
          language: "en_US",
          template_type: "standard",
          header_text: "Hello {{name}}!",
          message_body: "Hi {{1}}, your order {{2}} has been confirmed. Total: {{3}}.",
          footer_text: "Reply STOP to unsubscribe",
          variable_examples: [
             { "key": "1", "example": "John" },
             { "key": "2", "example": "ORD-9876" },
             { "key": "3", "example": "$49.99" }
          ]
        },
        response: {
          success: true,
          message: "Template submitted!",
          template_id: "64a1b2c3d4e5f6789abcdef9"
        }
      },
      {
        title: "OTP / Authentication Template",
        method: "POST",
        path: "/api/templates/create",
        contentType: "application/json",
        payload: {
          waba_id: "1248119146671221",
          template_name: "otp_verification",
          category: "AUTHENTICATION",
          language: "en_US",
          add_security_recommendation: true,
          code_expiration_minutes: 10,
          otp_code_length: 6,
          otp_buttons: [
            { "otp_type": "COPY_CODE", "copy_button_text": "Copy Code" }
          ]
        },
        response: {
          success: true,
          message: "OTP Template created!",
          template_id: "64a1b2c3d4e5f6789abcdef9"
        }
      },
      {
        title: "Template with Quick Reply Buttons",
        method: "POST",
        path: "/api/templates/create",
        contentType: "application/json",
        payload: {
          waba_id: "1248119146671221",
          template_name: "feedback_request",
          category: "UTILITY",
          language: "en_US",
          message_body: "How was your experience?",
          buttons: [
            { "type": "quick_reply", "text": "Excellent" },
            { "type": "quick_reply", "text": "Good" },
            { "type": "quick_reply", "text": "Poor" }
          ]
        },
        response: {
          success: true,
          message: "Template submitted!",
          template_id: "64a1b2c3d4e5f6789abcdef9"
        }
      },
      {
        title: "Template with CTA Buttons",
        method: "POST",
        path: "/api/templates/create",
        contentType: "application/json",
        payload: {
          waba_id: "1248119146671221",
          template_name: "contact_us",
          category: "MARKETING",
          language: "en_US",
          message_body: "Please contact us or visit our website.",
          buttons: [
            { "type": "phone_call", "text": "Call Support", "phone_number": "+1234567890" },
            { "type": "website", "text": "Visit Website", "website_url": "https://example.com" }
          ]
        },
        response: {
          success: true,
          message: "Template submitted!",
          template_id: "64a1b2c3d4e5f6789abcdef9"
        }
      },
      {
        title: "Template with Coupon Code",
        method: "POST",
        path: "/api/templates/create",
        contentType: "application/json",
        payload: {
          waba_id: "1248119146671221",
          template_name: "discount_coupon",
          category: "MARKETING",
          language: "en_US",
          message_body: "Here is your discount code!",
          buttons: [
            { "type": "copy_code", "text": "SAVE20" }
          ]
        },
        response: {
          success: true,
          message: "Template submitted!",
          template_id: "64a1b2c3d4e5f6789abcdef9"
        }
      },
      {
        title: "Limited Time Offer Template",
        method: "POST",
        path: "/api/templates/create",
        contentType: "application/json",
        payload: {
          waba_id: "1248119146671221",
          template_name: "flash_sale",
          category: "MARKETING",
          language: "en_US",
          message_body: "Flash sale is ending soon!",
          is_limited_time_offer: true,
          offer_text: "Use code FLASH at checkout",
          has_expiration: true
        },
        response: {
          success: true,
          message: "Template submitted!",
          template_id: "64a1b2c3d4e5f6789abcdef9"
        }
      },
      {
        title: "Template with Catalog Button",
        method: "POST",
        path: "/api/templates/create",
        contentType: "application/json",
        payload: {
          waba_id: "1248119146671221",
          template_name: "shop_catalog",
          category: "MARKETING",
          language: "en_US",
          message_body: "Check out our new catalog!",
          buttons: [
            { "type": "catalog", "text": "View Catalog" }
          ]
        },
        response: {
          success: true,
          message: "Template submitted!",
          template_id: "64a1b2c3d4e5f6789abcdef9"
        }
      },
      {
        title: "Template with Call Permission",
        method: "POST",
        path: "/api/templates/create",
        contentType: "application/json",
        payload: {
          waba_id: "1248119146671221",
          template_name: "call_request",
          category: "MARKETING",
          language: "en_US",
          message_body: "Can we call you to discuss our offers?",
          call_permission: true
        },
        response: {
          success: true,
          message: "Template submitted!",
          template_id: "64a1b2c3d4e5f6789abcdef9"
        }
      },
      {
        title: "Carousel Template",
        method: "POST",
        path: "/api/templates/create",
        contentType: "application/json",
        payload: {
          waba_id: "1248119146671221",
          template_name: "product_carousel",
          category: "MARKETING",
          language: "en_US",
          template_type: "carousel_product",
          message_body: "Check out these new products",
          carousel_cards: [
            {
              components: [
                { "type": "header", "format": "IMAGE", "example": { "header_url": "https://example.com/img1.png" } },
                { "type": "body", "text": "Product 1" },
                { "type": "buttons", "buttons": [{ "type": "url", "text": "Buy Now", "url": "https://example.com/buy/1" }] }
              ]
            },
            {
              components: [
                { "type": "header", "format": "IMAGE", "example": { "header_url": "https://example.com/img2.png" } },
                { "type": "body", "text": "Product 2" },
                { "type": "buttons", "buttons": [{ "type": "url", "text": "Buy Now", "url": "https://example.com/buy/2" }] }
              ]
            }
          ]
        },
        response: {
          success: true,
          message: "Template submitted!",
          template_id: "64a1b2c3d4e5f6789abcdef9"
        }
      }
    ],
  },
  {
    id: "campaign",
    title: "Broadcast API",
    description: "Launch and control bulk messaging campaigns.",
    endpoints: [
      {
        title: "Setup Campaign (All Contacts)",
        method: "POST",
        path: "/api/campaigns",
        contentType: "application/json",
        payload: {
          name: "March Newsletter",
          waba_id: "1248119146671221",
          template_name: "newsletter_template",
          recipient_type: "all_contacts",
          variables_mapping: { "1": "John", "2": "March 2026" },
        },
        response: {
          success: true,
          message: "Campaign created and sending started",
          data: { _id: "64a1b...", name: "March Newsletter", status: "sending", total_recipients: 500 }
        }
      },
      {
        title: "Setup Campaign (Specific Contacts)",
        method: "POST",
        path: "/api/campaigns",
        contentType: "application/json",
        payload: {
          name: "March Newsletter",
          waba_id: "1248119146671221",
          template_name: "newsletter_template",
          recipient_type: "specific_contacts",
          contact_numbers: ["91766787866678", "877677687788"],
          variables_mapping: { "1": "John", "2": "March 2026" }
        },
        response: {
          success: true,
          message: "Campaign created and sending started",
          data: { _id: "64a1b...", name: "Targeted Promo", status: "sending", total_recipients: 2 }
        }
      },
      {
        title: "Setup Scheduled Campaign (By Tags)",
        method: "POST",
        path: "/api/campaigns",
        contentType: "application/json",
        payload: {
          name: "Scheduled Reminder",
          waba_id: "1248119146671221",
          template_name: "reminder_template",
          recipient_type: "tags",
          tag_ids: ["64a1b2c3d4e5f6789abcdtag"],
          is_scheduled: true,
          scheduled_at: "2026-04-15T10:00:00Z"
        },
        response: {
          success: true,
          message: "Campaign created successfully",
          data: { status: "scheduled" }
        }
      },
      {
        title: "Setup Campaign with Media",
        method: "POST",
        path: "/api/campaigns",
        contentType: "application/json",
        payload: {
          name: "Media Announcement",
          waba_id: "1248119146671221",
          template_name: "media_offer",
          recipient_type: "all_contacts",
          media_url: "https://example.com/banner.jpg"
        },
        response: { success: true }
      },
      {
        title: "Setup Campaign with Dynamic Coupon",
        method: "POST",
        path: "/api/campaigns",
        contentType: "application/json",
        payload: {
          name: "Discount Campaign",
          waba_id: "1248119146671221",
          template_name: "coupon_offer",
          recipient_type: "all_contacts",
          coupon_code: "SPRING20"
        },
        response: { success: true }
      },
      {
        title: "Setup Campaign for Limited Time Offer",
        method: "POST",
        path: "/api/campaigns",
        contentType: "application/json",
        payload: {
          name: "Flash Sale Campaign",
          waba_id: "1248119146671221",
          template_name: "flash_sale",
          recipient_type: "all_contacts",
          offer_expiration_minutes: 60
        },
        response: { success: true }
      },
      {
        title: "Setup Campaign with Product Carousel",
        method: "POST",
        path: "/api/campaigns",
        contentType: "application/json",
        payload: {
          name: "Catalog Carousel",
          waba_id: "1248119146671221",
          template_name: "product_carousel",
          recipient_type: "all_contacts",
          carousel_products: [
            { product_retailer_id: "prod_1", catalog_id: "cat_1" },
            { product_retailer_id: "prod_2", catalog_id: "cat_1" }
          ]
        },
        response: { success: true }
      },
      {
        title: "Setup Campaign with Media Carousel",
        method: "POST",
        path: "/api/campaigns",
        contentType: "application/json",
        payload: {
          name: "Media Carousel Campaign",
          waba_id: "1248119146671221",
          template_name: "media_carousel",
          recipient_type: "all_contacts",
          carousel_cards_data: [
            {
              header: { type: "IMAGE", link: "https://example.com/img1.jpg" },
              buttons: [{ type: "url", url_value: "https://example.com/page1" }]
            },
            {
               header: { type: "IMAGE", link: "https://example.com/img2.jpg" },
               buttons: [{ type: "url", url_value: "https://example.com/page2" }]
            }
          ]
        },
        response: { success: true }
      },
      {
        title: "Setup Campaign with Media Carousel (Local Files)",
        method: "POST",
        path: "/api/campaigns",
        contentType: "multipart/form-data",
        payload: {
          name: "Media Carousel Campaign",
          waba_id: "1248119146671221",
          template_name: "media_carousel",
          recipient_type: "all_contacts",
          carousel_files: "(binary)",
          carousel_cards_data: [
            {
              header: { type: "IMAGE", link: "" },
              buttons: [{ type: "url", url_value: "https://example.com/page1" }]
            },
            {
              header: { type: "IMAGE", link: "" },
              buttons: [{ type: "url", url_value: "https://example.com/page2" }]
            }
          ]
        },
        response: { success: true }
      },
      {
        title: "Campaign List",
        method: "GET",
        path: "/api/campaigns",
        response: {
          success: true,
          message: "Campaigns fetched successfully!",
          campaigns: [
            {
              id: "64a1b2c3d4e5f6789abcd001",
              name: "February Blast",
              status: "completed",
            },
            {
              id: "64a1b2c3d4e5f6789abcd002",
              name: "March Promo",
              status: "scheduled",
            },
          ],
        },
      },
    ],
  },
  {
    id: "contacts",
    title: "Contact Management System",
    description: "Organize contacts and their associations.",
    endpoints: [
      {
        title: "Create Contact",
        method: "POST",
        path: "/api/contacts",
        contentType: "application/json",
        payload: {
          phone_number: "+919876543210",
          name: "John Doe",
          email: "john@example.com",
        },
        response: {
          success: true,
          message: "Contact created successfully!",
          contact: {
            id: "64a1b2c3d4e5f6789abcdef9",
            name: "John Doe",
            phone_number: "+919876543210",
          },
        },
      },
      {
        title: "List Contacts",
        method: "GET",
        path: "/api/contacts",
        response: {
          success: true,
          message: "Contacts fetched successfully!",
          contacts: [
            { id: "1", name: "Alice", phone: "+911111111111" },
            { id: "2", name: "Bob", phone: "+912222222222" },
          ],
        },
      },
    ],
  },
  {
    id: "infrastructure",
    title: "WhatsApp Configuration",
    description: "Handle WhatsApp account connections and numbers.",
    endpoints: [
      {
        title: "Fetch WABA Connections",
        method: "GET",
        path: "/api/whatsapp/connections",
        response: {
          success: true,
          message: "Connections fetched successfully!",
          connections: [
            {
              id: "64a1b2c3d4e5f6789abcdef0",
              name: "My Business WABA",
              whatsapp_business_account_id: "1234567890",
              is_active: true,
            },
          ],
        },
      },
      {
        title: "Fetch All Phone Numbers",
        method: "GET",
        path: "/api/whatsapp/phone-numbers",
        response: {
          success: true,
          message: "Phone numbers fetched successfully!",
          phone_numbers: [
            {
              id: "64a1phone01",
              display_phone_number: "+911234567890",
              is_primary: true,
            },
          ],
        },
      },
      {
        title: "Fetch WABA-Specific Phone Numbers",
        method: "GET",
        path: "/api/whatsapp/:wabaId/phone-numbers",
        response: {
          success: true,
          message: "WABA Phone numbers fetched!",
          data: [
            {
              phone_number_id: "1234567890",
              display_phone_number: "+911234567890",
            },
          ],
        },
      },
    ],
  },
];
