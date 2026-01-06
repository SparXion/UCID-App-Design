import { PrismaClient } from '@prisma/client';
import { CareerPathDto } from '../recommendation/dto/career-path.dto';
import { RecommendationService } from '../recommendation/recommendation.service';
import { QuizSubmissionDto } from '../student/dto/quiz-submission.dto';

const prisma = new PrismaClient();
const recommendationService = new RecommendationService();

export interface SaveQuizResultDto {
  name?: string;
  quizData: QuizSubmissionDto;
}

export interface QuizResultResponse {
  id: string;
  studentId: string;
  name: string | null;
  talents: any[];
  interests: any[];
  hybridMode: string | null;
  recommendations: CareerPathDto[];
  createdAt: Date;
}

export class QuizResultService {
  async saveQuizResult(studentId: string, dto: SaveQuizResultDto): Promise<QuizResultResponse> {
    // Get recommendations for this quiz submission
    // First, temporarily save the quiz data to get recommendations
    const { StudentProfileService } = await import('../student/student.service');
    const studentService = new StudentProfileService();
    
    // Save quiz data temporarily
    await studentService.submitQuiz(studentId, dto.quizData);
    
    // Get recommendations
    const recommendations = await recommendationService.getCareerPaths(studentId);
    
    // Save the result
    const result = await prisma.quizResult.create({
      data: {
        studentId,
        name: dto.name || null,
        talents: JSON.stringify(dto.quizData.talents),
        interests: JSON.stringify(dto.quizData.interests),
        hybridMode: dto.quizData.hybridMode || null,
        recommendations: JSON.stringify(recommendations)
      }
    });
    
    return {
      id: result.id,
      studentId: result.studentId,
      name: result.name,
      talents: JSON.parse(result.talents),
      interests: JSON.parse(result.interests),
      hybridMode: result.hybridMode,
      recommendations: JSON.parse(result.recommendations),
      createdAt: result.createdAt
    };
  }
  
  async getStudentResults(studentId: string): Promise<QuizResultResponse[]> {
    const results = await prisma.quizResult.findMany({
      where: { studentId },
      orderBy: { createdAt: 'desc' }
    });
    
    return results.map(r => ({
      id: r.id,
      studentId: r.studentId,
      name: r.name,
      talents: JSON.parse(r.talents),
      interests: JSON.parse(r.interests),
      hybridMode: r.hybridMode,
      recommendations: JSON.parse(r.recommendations),
      createdAt: r.createdAt
    }));
  }
  
  async getResultById(resultId: string, studentId: string): Promise<QuizResultResponse | null> {
    const result = await prisma.quizResult.findFirst({
      where: {
        id: resultId,
        studentId // Ensure student can only access their own results
      }
    });
    
    if (!result) return null;
    
    return {
      id: result.id,
      studentId: result.studentId,
      name: result.name,
      talents: JSON.parse(result.talents),
      interests: JSON.parse(result.interests),
      hybridMode: result.hybridMode,
      recommendations: JSON.parse(result.recommendations),
      createdAt: result.createdAt
    };
  }
  
  async getAllResults(limit?: number, offset?: number): Promise<QuizResultResponse[]> {
    const results = await prisma.quizResult.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            year: true
          }
        }
      }
    });
    
    return results.map(r => ({
      id: r.id,
      studentId: r.studentId,
      name: r.name,
      talents: JSON.parse(r.talents),
      interests: JSON.parse(r.interests),
      hybridMode: r.hybridMode,
      recommendations: JSON.parse(r.recommendations),
      createdAt: r.createdAt
    }));
  }
  
  async getResultsCount(): Promise<number> {
    return prisma.quizResult.count();
  }
  
  async deleteResult(resultId: string, studentId: string): Promise<boolean> {
    const result = await prisma.quizResult.deleteMany({
      where: {
        id: resultId,
        studentId // Ensure student can only delete their own results
      }
    });
    
    return result.count > 0;
  }
}

