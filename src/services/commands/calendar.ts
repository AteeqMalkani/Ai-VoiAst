export interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  attendees?: string[];
}

class CalendarService {
  /**
   * Fetch today's agenda events
   */
  async getTodayEvents(): Promise<CalendarEvent[]> {
    console.log('[CalendarService] Fetching today\'s events...');
    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    return [
      { id: 'ev-1', title: 'Code Sync Review', time: '11:00 AM', attendees: ['Alice', 'Bob'] },
      { id: 'ev-2', title: 'Product sync with Deepmind', time: '2:30 PM', attendees: ['Deepmind Team'] },
      { id: 'ev-3', title: 'Yoga & Workout Session', time: '6:00 PM' },
    ];
  }

  /**
   * Create a new calendar block
   */
  async createEvent(title: string, time: string): Promise<CalendarEvent> {
    console.log(`[CalendarService] Adding event: "${title}" at ${time}`);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      id: `ev-${Date.now()}`,
      title,
      time,
    };
  }
}

export const calendarService = new CalendarService();
