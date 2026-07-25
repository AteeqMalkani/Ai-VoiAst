import { ExecutionStep } from '@/components/voice';
import { calendarService } from './calendar';
import { gmailService } from './gmail';

class AutomationService {
  /**
   * Dispatches and executes a single step in a plan.
   * Leverages specific services based on step signatures.
   */
  async executeStep(step: ExecutionStep): Promise<void> {
    console.log(`[AutomationService] Executing step: ${step.action} - ${step.description}`);
    
    // Simulate real execution delay (1-2 seconds)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const actionKey = step.action.toLowerCase();
    const descKey = step.description.toLowerCase();

    try {
      if (actionKey.includes('cal') || descKey.includes('calendar')) {
        await calendarService.getTodayEvents();
      } else if (actionKey.includes('gmail') || descKey.includes('email') || actionKey.includes('slack')) {
        await gmailService.composeDraft('Workspace Update', 'Muted alerts and coding active.');
      } else {
        // General simulated system toggle (DND, IoT lights)
        console.log(`[AutomationService] Executed generic action: ${step.action}`);
      }
    } catch (error) {
      console.error(`[AutomationService] Error executing step ${step.id}`, error);
      throw error;
    }
  }
}

export const automationService = new AutomationService();
