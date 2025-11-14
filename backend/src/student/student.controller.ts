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
    await studentService.submitQuiz(id, dto);
    res.json({ success: true });
  } catch (error) {
    console.error('Quiz submission error:', error);
    res.status(500).json({ error: 'Failed to submit quiz' });
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
