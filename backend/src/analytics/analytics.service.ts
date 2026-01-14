import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface EventInput {
  studentId?: string | null;
  sessionId?: string | null;
  name: string;
  properties?: Record<string, any> | null;
}

export interface SurveyInput {
  studentId?: string | null;
  sessionId?: string | null;
  type: 'PRE' | 'POST';
  responses: Record<string, any>;
}

export interface PromptInput {
  studentId?: string | null;
  sessionId?: string | null;
  promptKey: string;
  rating?: number | null;
  responseText?: string | null;
}

export class AnalyticsService {
  async trackEvent(input: EventInput) {
    return prisma.event.create({
      data: {
        studentId: input.studentId || null,
        sessionId: input.sessionId || null,
        name: input.name,
        properties: input.properties || undefined,
      }
    });
  }

  async saveSurvey(input: SurveyInput) {
    return prisma.surveyResponse.create({
      data: {
        studentId: input.studentId || null,
        type: input.type,
        responses: input.responses,
      }
    });
  }

  async savePrompt(input: PromptInput) {
    return prisma.promptResponse.create({
      data: {
        studentId: input.studentId || null,
        promptKey: input.promptKey,
        rating: input.rating ?? null,
        responseText: input.responseText || null,
      }
    });
  }

  async getKpis(start?: Date, end?: Date) {
    const whereRange = start || end ? {
      createdAt: {
        ...(start && { gte: start }),
        ...(end && { lte: end })
      }
    } : undefined;

    const eventCounts = await prisma.event.groupBy({
      by: ['name'],
      _count: { name: true },
      ...(whereRange && { where: whereRange })
    });

    const mapCount = (name: string) => eventCounts.find((e: { name: string; _count: { name: number } }) => e.name === name)?._count.name || 0;

    const [students, surveysPre, surveysPost, prompts] = await Promise.all([
      prisma.student.count(),
      prisma.surveyResponse.count({ where: { type: 'PRE', ...(whereRange || {}) } }),
      prisma.surveyResponse.count({ where: { type: 'POST', ...(whereRange || {}) } }),
      prisma.promptResponse.count(whereRange ? { where: whereRange } : undefined)
    ]);

    return {
      students,
      events: {
        signup: mapCount('signup'),
        quiz_complete: mapCount('quiz_complete'),
        recommendations_viewed: mapCount('recommendations_viewed'),
        results_saved: mapCount('results_saved')
      },
      surveys: {
        pre: surveysPre,
        post: surveysPost
      },
      prompts
    };
  }

  async exportCsv(type: 'events' | 'surveys' | 'prompts', start?: Date, end?: Date) {
    const whereRange = start || end ? {
      createdAt: {
        ...(start && { gte: start }),
        ...(end && { lte: end })
      }
    } : undefined;

    if (type === 'events') {
      const rows = await prisma.event.findMany({
        where: whereRange,
        orderBy: { createdAt: 'desc' }
      });
      const headers = ['id', 'studentId', 'sessionId', 'name', 'properties', 'createdAt'];
      return this.toCsv(headers, rows.map((r: any) => ({
        id: r.id,
        studentId: r.studentId || '',
        sessionId: r.sessionId || '',
        name: r.name,
        properties: JSON.stringify(r.properties || {}),
        createdAt: r.createdAt.toISOString()
      })));
    }

    if (type === 'surveys') {
      const rows = await prisma.surveyResponse.findMany({
        where: whereRange,
        orderBy: { createdAt: 'desc' }
      });
      const headers = ['id', 'studentId', 'type', 'responses', 'createdAt'];
      return this.toCsv(headers, rows.map((r: any) => ({
        id: r.id,
        studentId: r.studentId || '',
        type: r.type,
        responses: JSON.stringify(r.responses || {}),
        createdAt: r.createdAt.toISOString()
      })));
    }

    const rows = await prisma.promptResponse.findMany({
      where: whereRange,
      orderBy: { createdAt: 'desc' }
    });
    const headers = ['id', 'studentId', 'promptKey', 'rating', 'responseText', 'createdAt'];
    return this.toCsv(headers, rows.map((r: any) => ({
      id: r.id,
      studentId: r.studentId || '',
      promptKey: r.promptKey,
      rating: r.rating ?? '',
      responseText: (r.responseText || '').replace(/\n/g, ' '),
      createdAt: r.createdAt.toISOString()
    })));
  }

  private toCsv(headers: string[], rows: Record<string, any>[]) {
    const escape = (value: any) => {
      const str = value === null || value === undefined ? '' : String(value);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const lines = [headers.join(',')];
    for (const row of rows) {
      lines.push(headers.map(h => escape(row[h])).join(','));
    }
    return lines.join('\n');
  }
}
