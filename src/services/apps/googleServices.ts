import { Buffer } from "buffer";

// ─── 1. GOOGLE CALENDAR API ───────────────────────────────────────────────

export interface CalendarEventParams {
  accessToken: string;
  summary: string;
  description?: string;
  startIsoString?: string;
  endIsoString?: string;
}

/**
 * Creates an event on the user's primary Google Calendar
 */
export async function createGoogleCalendarEvent({
  accessToken,
  summary,
  description = "Created via VoiAst Voice Assistant",
  startIsoString,
  endIsoString,
}: CalendarEventParams) {
  const startTime = startIsoString || new Date().toISOString();
  // Default end time is 1 hour after start
  const endTime =
    endIsoString || new Date(Date.now() + 60 * 60 * 1000).toISOString();

  try {
    const response = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summary,
          description,
          start: { dateTime: startTime },
          end: { dateTime: endTime },
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Calendar API Error: ${JSON.stringify(errorData)}`);
    }

    return await response.json();
  } catch (error) {
    console.error("[Google Calendar Service Error]:", error);
    throw error;
  }
}

// ─── 2. GMAIL API ─────────────────────────────────────────────────────────

export interface SendEmailParams {
  accessToken: string;
  to: string;
  subject: string;
  bodyText: string;
}

/**
 * Sends an email using the Gmail REST API
 */
export async function sendGmail({
  accessToken,
  to,
  subject,
  bodyText,
}: SendEmailParams) {
  try {
    // Construct RFC 2822 formatted email
    const rawMessage = [
      `To: ${to}`,
      "Content-Type: text/plain; charset=utf-8",
      "MIME-Version: 1.0",
      `Subject: ${subject}`,
      "",
      bodyText,
    ].join("\r\n");

    // Encode string to URL-safe Base64 format required by Gmail API
    const encodedEmail = Buffer.from(rawMessage)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const response = await fetch(
      "https://gmail.googleapis.com/upload/gmail/v1/users/me/messages/send",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ raw: encodedEmail }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gmail API Error: ${JSON.stringify(errorData)}`);
    }

    return await response.json();
  } catch (error) {
    console.error("[Gmail Service Error]:", error);
    throw error;
  }
}
