export interface GmailDraft {
  id: string;
  to?: string;
  subject: string;
  body: string;
}

class GmailService {
  /**
   * Composes a draft message in the user's inbox.
   */
  async composeDraft(subject: string, body: string, to?: string): Promise<GmailDraft> {
    console.log(`[GmailService] Creating draft message: "${subject}" to "${to || 'me'}"`);
    await new Promise((resolve) => setTimeout(resolve, 900));

    return {
      id: `draft-${Date.now()}`,
      to,
      subject,
      body,
    };
  }

  /**
   * Sends an email message.
   */
  async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
    console.log(`[GmailService] Dispatching email to "${to}"...`);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    return true;
  }
}

export const gmailService = new GmailService();
