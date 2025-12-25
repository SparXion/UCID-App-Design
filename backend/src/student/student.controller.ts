import { Router, Request, Response } from 'express';
import { StudentProfileService } from './student.service';
import { QuizSubmissionDto } from './dto/quiz-submission.dto';
import { PrismaClient } from '@prisma/client';

const router = Router();
const studentService = new StudentProfileService();
const prisma = new PrismaClient();

router.post('/:id/quiz', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const dto = req.body as QuizSubmissionDto;
    
    // Log request for debugging
    console.log(`[Quiz Submission] Student ID: ${id}`);
    console.log(`[Quiz Submission] Talents: ${dto.talents?.length || 0}, Interests: ${dto.interests?.length || 0}`);
    
    // Validate required fields
    if (!dto.talents || !Array.isArray(dto.talents)) {
      console.error('[Quiz Submission] Validation failed: talents array missing');
      return res.status(400).json({ error: 'Talents array is required' });
    }
    if (!dto.interests || !Array.isArray(dto.interests)) {
      console.error('[Quiz Submission] Validation failed: interests array missing');
      return res.status(400).json({ error: 'Interests array is required' });
    }
    
    // Validate that at least one talent or interest is provided
    if (dto.talents.length === 0 && dto.interests.length === 0) {
      console.error('[Quiz Submission] Validation failed: no talents or interests provided');
      return res.status(400).json({ error: 'At least one talent or interest is required' });
    }
    
    await studentService.submitQuiz(id, dto);
    console.log(`[Quiz Submission] Success for student ${id}`);
    res.json({ success: true });
  } catch (error: any) {
    console.error('[Quiz Submission] Error:', error);
    console.error('[Quiz Submission] Error message:', error.message);
    console.error('[Quiz Submission] Error stack:', error.stack);
    
    // Provide more detailed error information
    const errorResponse: any = {
      error: 'Failed to submit quiz',
      details: error.message
    };
    
    // Include Prisma-specific error details if available
    if (error.code) {
      errorResponse.code = error.code;
    }
    if (error.meta) {
      errorResponse.meta = error.meta;
    }
    
    res.status(500).json(errorResponse);
  }
});

router.get('/:id/quiz-status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        interests: true,
        talents: true
      }
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const hasQuiz = student.interests.length > 0 || student.talents.length > 0;
    res.json({ hasQuiz });
  } catch (error) {
    console.error('Quiz status error:', error);
    res.status(500).json({ error: 'Failed to check quiz status' });
  }
});

export default router;
