import { sparkService } from './sparkService';

export const revisitService = {
  async markRevisited(sparkId: string, note?: string) {
    return sparkService.markRevisited(sparkId, note);
  },

  async fetchRevisitEvents(sparkId?: string) {
    const events = await sparkService.fetchRevisitEvents();
    return sparkId ? events.filter((event) => event.sparkId === sparkId) : events;
  }
};
