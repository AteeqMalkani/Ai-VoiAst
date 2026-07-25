import { ExecutionStep } from '@/components/voice';
import { Automation } from '@/store/automationStore';

export interface AIResponse {
  spokenReply: string;
  planTitle?: string;
  steps?: Omit<ExecutionStep, 'status'>[];
}

class AIService {
  /**
   * Processes voice commands to extract user intent, generating structured plans.
   */
  async processCommand(transcript: string, activeAutomations: Automation[]): Promise<AIResponse> {
    const text = transcript.toLowerCase().trim();

    // 1. Search for matching active user automations first
    const matchedAuto = activeAutomations.find(
      (auto) => auto.isActive && text.includes(auto.trigger)
    );

    if (matchedAuto) {
      if (matchedAuto.id === 'auto-1') {
        return {
          spokenReply: 'Initiating your Focus Mode automation. All channels will be muted and your workspace prepped.',
          planTitle: 'Focus Mode Sequence',
          steps: [
            { id: 'step-dnd', action: 'Configure DND', description: 'Enable system-wide Do Not Disturb' },
            { id: 'step-editor', action: 'Open Editor', description: 'Launch VS Code workspace' },
            { id: 'step-slack', action: 'Slack Update', description: 'Set Slack status to "In code workflow"' },
          ],
        };
      }
      
      if (matchedAuto.id === 'auto-2') {
        return {
          spokenReply: 'Starting your desk accessories. Lights and ventilation fan are spinning up.',
          planTitle: 'Desk Power Sequence',
          steps: [
            { id: 'step-light', action: 'Desk Lights', description: 'Switch IoT smart bulb to workspace mode' },
            { id: 'step-fan', action: 'Desk Fan', description: 'Activate IoT desk fan at medium speed' },
          ],
        };
      }

      // Default representation for custom created automations
      return {
        spokenReply: `Initiating automation sequence: ${matchedAuto.title}.`,
        planTitle: matchedAuto.title,
        steps: matchedAuto.action.split('|').map((actionStr, idx) => ({
          id: `step-custom-${idx}`,
          action: actionStr.trim().split(':')[0] || 'Trigger Action',
          description: actionStr.trim(),
        })),
      };
    }

    // 2. Keyword heuristic routing
    if (text.includes('email') || text.includes('gmail') || text.includes('send a message')) {
      return {
        spokenReply: 'Preparing an email draft in Gmail. Let me know if you would like me to write it.',
        planTitle: 'Draft Email Sequence',
        steps: [
          { id: 'step-gmail-compose', action: 'Open Draft compose', description: 'Initialize Gmail API editor' },
          { id: 'step-gmail-write', action: 'Compose Content', description: 'Fill subject line and body copy templates' },
        ],
      };
    }

    if (text.includes('calendar') || text.includes('meeting') || text.includes('schedule')) {
      return {
        spokenReply: 'Checking your calendar schedule for the day.',
        planTitle: 'Calendar Sync Sequence',
        steps: [
          { id: 'step-cal-sync', action: 'Fetch Events', description: 'Query Google Calendar API for today\'s meetings' },
          { id: 'step-cal-brief', action: 'Generate Briefing', description: 'Synthesize schedule details to voice pilot text' },
        ],
      };
    }

    // 3. Fallback conversational AI response
    return {
      spokenReply: `I heard you say: "${transcript}". I can help you compile automations or sync services for this. What details should we add?`,
    };
  }
}

export const aiService = new AIService();
