import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Prospect } from '../prospect/schemas/prospect.schema';

interface EmailTemplate {
  subject: string;
  text: string;
  html: string;
}

@Injectable()
export class EmailTemplateService {
  constructor(private readonly configService: ConfigService) {}

  private getEmailStyles(): string {
    return `
      <style>
        .email-container {
          font-family: 'Roboto', Arial, sans-serif;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          line-height: 1.6;
          color: #116dff;
        }
        .header {
          color: #fe5d2f;
          margin-bottom: 20px;
        }
        .content {
          background-color: #ffffff;
          padding: 20px;
          border-radius: 4px;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        }
        .footer {
          margin-top: 20px;
          color: #64748b;
          font-size: 14px;
          border-top: 1px solid #e2e8f0;
          padding-top: 20px;
          text-align: center;
        }
        .info-section {
          margin: 15px 0;
          padding: 15px;
          background-color: #f8fafc;
          border-radius: 4px;
        }
        .info-label {
          font-weight: 500;
          color: #fe5d2f;
          min-width: 150px;
          display: inline-block;
        }
        .button {
          display: inline-block;
          padding: 10px 20px;
          background-color: #fc6100;
          color: white !important;
          text-decoration: none;
          border-radius: 4px;
          margin: 10px 0;
          font-weight: 500;
        }
        .accent {
          color: #116dff;
        }
      </style>
    `;
  }

  private getEmailFooter(): string {
    return `
      <div class="footer">
        <p style="color: #fe5d2f; font-weight: 500;">Zomma</p>
        <p style="font-size: 12px; color: #64748b;">This is an automated message. Please do not reply to this email.</p>
      </div>
    `;
  }

  /**
   * Generate an email template for prospect application notifications
   */
  getProspectApplicationTemplate(prospect: Prospect): EmailTemplate {
    const { firstName, lastName } = prospect.contact.name;

    const text = `New Prospect Application Received

A new prospect application has been submitted by ${firstName} ${lastName}.

Contact Information:
- Name: ${firstName} ${lastName}
- Email: ${prospect.contact.email}
- Phone: ${prospect.contact.phone}
- Preferred Contact Method: ${prospect.contact.preferredContact}

Goals:
- Financial Goals: ${prospect.goals.financialGoals}
- Challenges: ${prospect.goals.challenges}

Services Requested:
- ${prospect.services.selectedServices.join('\n- ')}

Budget Range:
- ${prospect.budget.budgetRange}

${prospect.notes ? `Additional Notes:\n${prospect.notes}` : ''}

Please review this application in the admin dashboard and follow up with the prospect as soon as possible.

Regards,
Zomma Team`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          ${this.getEmailStyles()}
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h2>New Prospect Application Received</h2>
            </div>
            <div class="content">
              <p>A new prospect application has been submitted by <strong>${firstName} ${lastName}</strong>.</p>
              
              <div class="info-section">
                <h3 style="color: #fe5d2f; margin-bottom: 15px;">Contact Information</h3>
                <p><span class="info-label">Name:</span> ${firstName} ${lastName}</p>
                <p><span class="info-label">Email:</span> <a href="mailto:${prospect.contact.email}" style="color: #7ec265;">${prospect.contact.email}</a></p>
                <p><span class="info-label">Phone:</span> ${prospect.contact.phone}</p>
                <p><span class="info-label">Preferred Contact:</span> ${prospect.contact.preferredContact}</p>
              </div>

              <div class="info-section">
                <h3 style="color: #fe5d2f; margin-bottom: 15px;">Goals</h3>
                <p><span class="info-label">Financial Goals:</span> ${prospect.goals.financialGoals}</p>
                <p><span class="info-label">Challenges:</span> ${prospect.goals.challenges}</p>
              </div>

              <div class="info-section">
                <h3 style="color: #fe5d2f; margin-bottom: 15px;">Services Requested</h3>
                <ul style="list-style-type: none; padding-left: 20px; margin: 10px 0;">
                  ${prospect.services.selectedServices
                    .map(
                      (service) =>
                        `<li style="margin: 5px 0;">• ${service}</li>`
                    )
                    .join('')}
                </ul>
              </div>

              <div class="info-section">
                <h3 style="color: #fe5d2f; margin-bottom: 15px;">Budget Range</h3>
                <p>${prospect.budget.budgetRange}</p>
              </div>

              ${
                prospect.notes
                  ? `
              <div class="info-section">
                <h3 style="color: #fe5d2f; margin-bottom: 15px;">Additional Notes</h3>
                <p>${prospect.notes}</p>
              </div>`
                  : ''
              }

              <p>Please review this application in the admin dashboard and follow up with the prospect as soon as possible.</p>
            </div>
            ${this.getEmailFooter()}
          </div>
        </body>
      </html>
    `;

    return {
      subject: 'New Prospect Application Received',
      text,
      html,
    };
  }
}
