import PDFDocument from 'pdfkit';
import { FeePayment, StudentFee, FeeStructure } from '../models/index.js';
import { StudentProfile } from '../../students/models/index.js';
import User from '../../users/models/user.model.js';
import catchAsync from '../../../utils/catchAsync.js';
import AppError from '../../../utils/appError.js';

export const downloadPDFReceipt = catchAsync(async (req, res, next) => {
    const { paymentId } = req.params;

    const payment = await FeePayment.findByPk(paymentId, {
        include: [
            { 
                model: StudentFee, 
                as: 'studentFee',
                include: [{ model: FeeStructure, as: 'feeStructure' }]
            },
        ]
    });

    if (!payment) return next(new AppError('Payment not found', 404));

    // Get Student manually to be safe with nesting
    const student = await StudentProfile.findByPk(payment.studentProfileId, {
        include: [{ model: User, as: 'user', attributes: ['name', 'email'] }]
    });

    // Generate PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Receipt_${payment.receiptNumber}.pdf`);

    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);

    // Header
    doc.fontSize(20).text('CampusOne Payment Receipt', { align: 'center' });
    doc.moveDown();
    
    // Receipt Details
    doc.fontSize(12)
       .text(`Receipt Number: ${payment.receiptNumber}`)
       .text(`Date: ${new Date(payment.paymentDate).toLocaleDateString()}`)
       .text(`Status: ${payment.status}`)
       .text(`Payment Method: ${payment.paymentMethod}`)
       .text(`Transaction ID: ${payment.transactionId}`);
    doc.moveDown();

    // Student Details
    doc.text(`Student Name: ${student?.user?.name || 'Unknown'}`)
       .text(`Registration: ${student?.registrationNumber || 'N/A'}`);
    doc.moveDown();

    // Amount info
    doc.text(`Paid Amount: INR ${payment.amountPaid}`)
       .text(`Remaining Balance: INR ${Math.max(0, payment.studentFee?.finalAmount - payment.studentFee?.paidAmount)}`);
    
    doc.moveDown(2);
    doc.text('Thank you for the payment!', { align: 'center' });
    
    doc.end();
});
